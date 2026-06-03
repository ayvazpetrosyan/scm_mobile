import React, {useEffect, useState, useCallback} from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {useTranslation} from "react-i18next";
import API from "@/app/services/api";
import {getToken, removeToken} from "@/app/services/tokenStorage";

type FilterGeneralType = {
    id: string;
    title: string;
    preSelected?: boolean;
};

type SelectOption = {
    value: string;
    label: string;
};

type SelectProps = {
    className?: string;
    value: SelectOption | null;
    options: SelectOption[];
    placeholder: string;
    onChange: (option: SelectOption | null) => void;
};

function Select({value, options, placeholder, onChange}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedLabel = value?.label || placeholder;

    return (
        <View>
            <Pressable style={selectStyles.trigger} onPress={() => setIsOpen(true)}>
                <Text style={value ? selectStyles.triggerText : selectStyles.placeholderText}>
                    {selectedLabel}
                </Text>
            </Pressable>

            <Modal
                visible={isOpen}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={() => setIsOpen(false)}
            >
                <View style={selectStyles.modalContainer}>
                    <View style={selectStyles.modalHeader}>
                        <Text style={selectStyles.modalTitle}>{placeholder}</Text>

                        <Pressable onPress={() => setIsOpen(false)}>
                            <Text style={selectStyles.closeText}>✕</Text>
                        </Pressable>
                    </View>

                    <FlatList
                        data={[{value: '', label: placeholder}, ...options]}
                        keyExtractor={(item) => item.value || '__empty__'}
                        renderItem={({item}) => {
                            const isSelected = value?.value === item.value || (!value && item.value === '');

                            return (
                                <Pressable
                                    style={[
                                        selectStyles.option,
                                        isSelected && selectStyles.selectedOption,
                                    ]}
                                    onPress={() => {
                                        const selectedOption = item.value
                                            ? options.find((option) => option.value === item.value) ?? null
                                            : null;

                                        onChange(selectedOption);
                                        setIsOpen(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            selectStyles.optionText,
                                            isSelected && selectStyles.selectedOptionText,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </Pressable>
                            );
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
}

const selectStyles = StyleSheet.create({
    trigger: {
        minHeight: 48,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        paddingHorizontal: 12,
        marginTop: 6,
    },
    triggerText: {
        fontSize: 16,
        color: '#111827',
    },
    placeholderText: {
        fontSize: 16,
        color: '#64748b',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    modalHeader: {
        minHeight: 64,
        paddingHorizontal: 16,
        paddingTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    closeText: {
        fontSize: 24,
        color: '#1a73e8',
        paddingHorizontal: 8,
    },
    option: {
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    selectedOption: {
        backgroundColor: '#e8f1ff',
    },
    optionText: {
        fontSize: 16,
        color: '#111827',
    },
    selectedOptionText: {
        color: '#1a73e8',
        fontWeight: '600',
    },
});

type FilterProps<TPageData> = {
    pageDataRoute: string | null;
    filters: {
        semester?: string | null;
        month?: string | null;
        scmClass?: string | null;
        subject?: string | null;
        subjectByUser?: string | null;
        subjectByUserAndClass?: string | null;
        studentByClass?: string | null;
    };
    setPageData: React.Dispatch<React.SetStateAction<TPageData>> | null;
    setPageDataLoading: React.Dispatch<React.SetStateAction<boolean>> | null;
    setPageDataError: React.Dispatch<React.SetStateAction<string | null>> | null;
    emptyPageData: TPageData;
};

export function Filter<TPageData>({
                                      filters,
                                      pageDataRoute,
                                      setPageData,
                                      setPageDataLoading,
                                      setPageDataError,
                                      emptyPageData,
                                  }: FilterProps<TPageData>) {
    const {t} = useTranslation();

    const [semesterData, setSemesterData] = useState<FilterGeneralType[]>([]);
    const [monthData, setMonthData] = useState<FilterGeneralType[]>([]);
    const [classData, setClassData] = useState<FilterGeneralType[]>([]);
    const [subjectData, setSubjectData] = useState<FilterGeneralType[]>([]);
    const [studentData, setStudentData] = useState<FilterGeneralType[]>([]);
    const [data, setFormData] = useState({
        semesterId: '' as string | null,
        monthId: '' as string | null,
        classId: '' as string | null,
        subjectId: '' as string | null,
        studentId: '' as string | null,
    });

    const errors: Partial<Record<keyof typeof data, string>> = {};

    const setData = useCallback(<K extends keyof typeof data>(key: K, value: typeof data[K]) => {
        setFormData((previousData) => ({
            ...previousData,
            [key]: value,
        }));
    }, []);

    const getPreSelectedId = (items: FilterGeneralType[]) => {
        return items.find((item) => item.preSelected)?.id ?? null;
    };

    const getData = useCallback(async (updated: Partial<typeof data>) => {
        if (!pageDataRoute || !setPageDataLoading || !setPageDataError || !setPageData) {
            return;
        }
        const token = await getToken();

        const payload = {
            semesterId: updated.semesterId ?? data.semesterId ?? null,
            monthId: updated.monthId ?? data.monthId ?? null,
            classId: updated.classId ?? data.classId ?? null,
            subjectId: updated.subjectId ?? data.subjectId ?? null,
            studentId: updated.studentId ?? data.studentId ?? null,
        };

        setPageDataLoading(true);
        setPageDataError(null);
        setPageData(emptyPageData);

        API.get(pageDataRoute, {
            headers: {Authorization: `Bearer ${token}`},
            params: payload,
        })
            .then((response) => {
                response.data.subjectId = payload.subjectId;
                setPageData(response.data);
            })
            .catch((err) => {
                console.error('Error fetching filters:', err);
                setPageDataError('Error fetching filters');
            })
            .finally(() => {
                setPageDataLoading(false);
            });
    }, [data.classId, data.monthId, data.semesterId, data.studentId, data.subjectId, emptyPageData, pageDataRoute, setPageData, setPageDataError, setPageDataLoading]);

    const getSubjectsByCLass = useCallback((classId: string | null) => {
        if (!classId) {
            setSubjectData([]);
            setData('subjectId', null);
            return;
        }

        sendApiRequest('/filter/subject/by/class', setSubjectData, {'classId': classId}).then(r => console.log('Subjects by class filter load result: ', r));
    }, [setData]);

    const getStudentsByClass = useCallback((classId: string | null) => {
        if (!classId) {
            setStudentData([]);
            setData('studentId', null);
            return;
        }

        sendApiRequest('/filter/student/by/class', setStudentData, {'classId': classId}).then(r => console.log('Students by class filter load result: ', r));
    }, [setData]);

    const getSubjectsByCurrentUserAndCLass = useCallback((classId: string | null) => {
        if (!classId) {
            setSubjectData([]);
            setData('subjectId', null);
            return;
        }

        sendApiRequest('/filter/subject/by/user-and-class', setSubjectData, {'classId': classId}).then(r => console.log('Subjects by user and class filter load result: ', r));
    }, [setData]);

    const sendApiRequest = async (
        url: string,
        callBackFunction: (value: (((prevState: FilterGeneralType[]) => FilterGeneralType[]) | FilterGeneralType[])) => void,
        payload: any = {},
    ) => {
        const token = await getToken();
        payload.headers = {Authorization: `Bearer ${token}`}
        await API
            .get(url, payload)
            .then((res) => callBackFunction(res.data))
            .catch((err) => console.error('Error sending API request:', err));
    }

    useEffect(() => {
        if (filters.semester) {
            sendApiRequest('/filter/semester', setSemesterData).then(r => console.log('Semester filter load result: ', r));
        }
    }, [filters.semester]);

    useEffect(() => {
        if (filters.month) {
            sendApiRequest('/filter/month', setMonthData).then(r => console.log('Month filter load result: ', r));
        }
    }, [filters.month]);

    useEffect(() => {
        if (filters.scmClass || filters.subjectByUser || filters.subjectByUserAndClass) {
            sendApiRequest('/filter/class', setClassData).then(r => console.log('Class filter load result: ', r));
        }
    }, [filters.scmClass, filters.subjectByUser, filters.subjectByUserAndClass]);

    useEffect(() => {
        if (filters.subjectByUser) {
            sendApiRequest('/filter/subject/by/user', setSubjectData).then(r => console.log('subjectByUser filter load result: ', r));
        }
    }, [filters.subjectByUser]);

    useEffect(() => {
        const semesterId = getPreSelectedId(semesterData);

        if (!semesterId || data.semesterId) {
            return;
        }

        setData('semesterId', semesterId);
        getData({...data, semesterId});
    }, [data, getData, semesterData, setData]);

    useEffect(() => {
        const monthId = getPreSelectedId(monthData);

        if (!monthId || data.monthId) {
            return;
        }

        setData('monthId', monthId);
        getData({...data, monthId});
    }, [data, getData, monthData, setData]);

    useEffect(() => {
        const classId = getPreSelectedId(classData);

        if (!classId || data.classId) {
            return;
        }

        setData('classId', classId);

        if (filters.subject) {
            getSubjectsByCLass(classId);
        }

        if (filters.subjectByUserAndClass) {
            getSubjectsByCurrentUserAndCLass(classId);
        }

        if (filters.studentByClass) {
            getStudentsByClass(classId);
        }

        getData({...data, classId});
    }, [classData, data, filters.studentByClass, filters.subject, filters.subjectByUserAndClass, getData, getStudentsByClass, getSubjectsByCLass, getSubjectsByCurrentUserAndCLass, setData]);

    useEffect(() => {
        const subjectId = getPreSelectedId(subjectData);

        if (!subjectId || data.subjectId) {
            return;
        }

        setData('subjectId', subjectId);
        getData({...data, subjectId});
    }, [data, getData, setData, subjectData]);

    useEffect(() => {
        const studentId = getPreSelectedId(studentData);

        if (!studentId || data.studentId) {
            return;
        }

        setData('studentId', studentId);
        getData({...data, studentId});
    }, [data, getData, setData, studentData]);

    return (
        <View style={filterStyles.container}>
            {/* Semester filter */}
            {filters.semester && (
                <View style={filterStyles.field}>
                    <Text style={filterStyles.label}>{t('filter.semester.label')}</Text>
                    <Select
                        className={'z-[55]'}
                        value={
                            data.semesterId
                                ? {
                                    value: data.semesterId,
                                    label: semesterData.find((semester) => semester.id === data.semesterId)?.title ?? '',
                                }
                                : null
                        }
                        options={semesterData.map((semester) => ({
                            value: semester.id,
                            label: semester.title ?? '',
                        }))}
                        placeholder={t('Select semester')}
                        onChange={(option) => {
                            const value = option ? option.value : null;
                            setData('semesterId', value);
                            getData({...data, semesterId: value});
                        }}
                    />
                    {errors.semesterId ? (
                        <Text style={filterStyles.errorText}>{errors.semesterId}</Text>
                    ) : null}
                </View>
            )}

            {/* Month filter */}
            {filters.month && (
                <View style={filterStyles.field}>
                    <Text style={filterStyles.label}>{t('Month')}</Text>
                    <Select
                        className={'z-[50]'}
                        value={
                            data.monthId
                                ? {
                                    value: data.monthId,
                                    label: monthData.find((month) => month.id === data.monthId)?.title ?? '',
                                }
                                : null
                        }
                        options={monthData.map((month) => ({
                            value: month.id,
                            label: month.title ?? '',
                        }))}
                        placeholder={t('Select month')}
                        onChange={(option) => {
                            const value = option ? option.value : null;
                            setData('monthId', value);
                            getData({...data, monthId: value});
                        }}
                    />
                    {errors.monthId ? (
                        <Text style={filterStyles.errorText}>{errors.monthId}</Text>
                    ) : null}
                </View>
            )}

            {/* Class filter */}
            {filters.scmClass && (
                <View style={filterStyles.field}>
                    <Text style={filterStyles.label}>{t('Class')}</Text>
                    <Select
                        className={'z-[45]'}
                        value={
                            data.classId
                                ? {
                                    value: data.classId,
                                    label: classData.find((scmClass) => scmClass.id === data.classId)?.title ?? '',
                                }
                                : null
                        }
                        options={classData.map((scmClass) => ({
                            value: scmClass.id,
                            label: scmClass.title ?? '',
                        }))}
                        placeholder={t('Select class')}
                        onChange={(option) => {
                            const value = option ? option.value : null;
                            setData('classId', value);

                            if (filters.subject) {
                                setData('subjectId', null);
                                getSubjectsByCLass(value);
                            }

                            if (filters.studentByClass) {
                                setData('studentId', null);
                                getStudentsByClass(value);
                            }

                            getData({...data, classId: value, subjectId: null, studentId: null});
                        }}
                    />
                    {errors.classId ? (
                        <Text style={filterStyles.errorText}>{errors.classId}</Text>
                    ) : null}
                </View>
            )}

            {/* Subject by user and class filter */}
            {filters.subjectByUserAndClass && (
                <View style={filterStyles.field}>
                    <Text style={filterStyles.label}>{t('Class')}</Text>
                    <Select
                        className={'z-[45]'}
                        value={
                            data.classId
                                ? {
                                    value: data.classId,
                                    label: classData.find((scmClass) => scmClass.id === data.classId)?.title ?? '',
                                }
                                : null
                        }
                        options={classData.map((scmClass) => ({
                            value: scmClass.id,
                            label: scmClass.title ?? '',
                        }))}
                        placeholder={t('Select class')}
                        onChange={(option) => {
                            const value = option ? option.value : null;
                            setData('classId', value);
                            setData('subjectId', null);
                            getSubjectsByCurrentUserAndCLass(value);
                            getData({...data, classId: value, subjectId: null});
                        }}
                    />
                    {errors.classId ? (
                        <Text style={filterStyles.errorText}>{errors.classId}</Text>
                    ) : null}
                </View>
            )}

            {/* Subject filter */}
            {subjectData.length > 0 && (
                <View style={filterStyles.field}>
                    <Text style={filterStyles.label}>{t('Subject')}</Text>
                    <Select
                        className={'z-[40]'}
                        value={
                            data.subjectId
                                ? {
                                    value: data.subjectId,
                                    label: subjectData.find((subject) => subject.id === data.subjectId)?.title ?? '',
                                }
                                : null
                        }
                        options={subjectData.map((subject) => ({
                            value: subject.id,
                            label: subject.title ?? '',
                        }))}
                        placeholder={t('Select subject')}
                        onChange={(option) => {
                            const value = option ? option.value : null;
                            setData('subjectId', value);
                            getData({...data, subjectId: value});
                        }}
                    />
                    {errors.subjectId ? (
                        <Text style={filterStyles.errorText}>{errors.subjectId}</Text>
                    ) : null}
                </View>
            )}

            {/* Student by class filter */}
            {filters.studentByClass && (
                <View style={filterStyles.field}>
                    <Text style={filterStyles.label}>{t('Student')}</Text>
                    <Select
                        className={'z-[45]'}
                        value={
                            data.studentId
                                ? {
                                    value: data.studentId,
                                    label: studentData.find((student) => student.id === data.studentId)?.title ?? '',
                                }
                                : null
                        }
                        options={studentData.map((student) => ({
                            value: student.id,
                            label: student.title ?? '',
                        }))}
                        placeholder={t('Select student')}
                        onChange={(option) => {
                            const value = option ? option.value : null;
                            setData('studentId', value);
                            getData({...data, studentId: value});
                        }}
                    />
                    {errors.studentId ? (
                        <Text style={filterStyles.errorText}>{errors.studentId}</Text>
                    ) : null}
                </View>
            )}
        </View>
    );
}

const filterStyles = StyleSheet.create({
    container: {
        gap: 14,
        marginBottom: 16,
    },
    field: {
        width: '100%',
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    errorText: {
        marginTop: 4,
        fontSize: 13,
        color: '#ef4444',
    },
});
