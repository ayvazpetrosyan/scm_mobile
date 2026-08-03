import React, {useMemo, useState} from "react";
import {
    ActivityIndicator, Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {WebView} from "react-native-webview";

export type TransportMapPoint = {
    title: string;
    lat: number;
    lng: number;
};

type TransportMapProps = {
    points?: TransportMapPoint[];
    center?: {
        lat: number;
        lng: number;
    };
    zoom?: number;
    height?: number;
};

const transportMapCenter = {
    lat: 40.1872,
    lng: 44.5152,
};

export function TransportMap({
                          points,
                          center = transportMapCenter,
                          zoom = 13,
                          height = 800,
                      }: TransportMapProps) {
    const [mapError, setMapError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    const mapId = process.env.EXPO_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

    const html = useMemo(() => {
        const safePoints = JSON.stringify(points);
        const safeCenter = JSON.stringify(center);

        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                    <style>
                        html,
                        body,
                        #map {
                            height: 100%;
                            width: 100%;
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                            background: #f5f7fa;
                        }

                        .error {
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 16px;
                            box-sizing: border-box;
                            color: #b91c1c;
                            font-family: Arial, sans-serif;
                            text-align: center;
                            background: #fef2f2;
                        }
                    </style>
                </head>
                <body>
                    <div id="map"></div>

                    <script>
                        const mapCenter = ${safeCenter};
                        const markedPoints = ${safePoints};

                        function showError(message) {
                            document.body.innerHTML = '<div class="error">' + message + '</div>';
                        }

                        async function initTransportMap() {
                            try {
                                if (!window.google || !window.google.maps) {
                                    showError('Google Maps did not load correctly.');
                                    return;
                                }

                                const { Map } = await google.maps.importLibrary('maps');
                                const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

                                const map = new Map(document.getElementById('map'), {
                                    center: mapCenter,
                                    zoom: ${zoom},
                                    mapId: '${mapId}',
                                    mapTypeControl: true,
                                    streetViewControl: true,
                                    fullscreenControl: false,
                                });

                                markedPoints.forEach((point) => {
                                    new AdvancedMarkerElement({
                                        position: {
                                            lat: Number(point.lat),
                                            lng: Number(point.lng),
                                        },
                                        map,
                                        title: point.title,
                                    });
                                });
                            } catch (error) {
                                showError('Failed to initialize Google Maps.');
                            }
                        }

                        window.initTransportMap = initTransportMap;
                    </script>

                    <script
                        src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=initTransportMap"
                        async
                        defer
                        onerror="showError('Failed to load Google Maps script. Please check your API key and billing settings.')"
                    ></script>
                </body>
            </html>
        `;
    }, [apiKey, center, mapId, points, zoom]);

    if (!apiKey) {
        return (
            <View style={[styles.errorContainer, {height}]}>
                <Text style={styles.errorText}>
                    Google Maps API key is missing.
                </Text>
            </View>
        );
    }

    if (Platform.OS === "web") {
        return (
            <View style={[styles.container, {height}]}>
                <iframe
                    title="Transport map"
                    srcDoc={html}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: 0,
                        borderRadius: 16,
                    }}
                />
            </View>
        );
    }

    return (
        <View style={[styles.container, {height}]}>
            {mapError ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{mapError}</Text>
                </View>
            ) : (
                <>
                    <WebView
                        originWhitelist={["*"]}
                        source={{html}}
                        javaScriptEnabled
                        domStorageEnabled
                        startInLoadingState
                        onLoadStart={() => setIsLoading(true)}
                        onLoadEnd={() => setIsLoading(false)}
                        onError={() => {
                            setMapError("Failed to load map.");
                            setIsLoading(false);
                        }}
                        onHttpError={() => {
                            setMapError("Failed to load map resources.");
                            setIsLoading(false);
                        }}
                        style={styles.webView}
                    />

                    {isLoading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#1a73e8"/>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },

    webView: {
        flex: 1,
        backgroundColor: "#f5f7fa",
    },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.65)",
    },

    errorContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#fef2f2",
        borderWidth: 1,
        borderColor: "#fecaca",
    },

    errorText: {
        color: "#b91c1c",
        fontSize: 14,
        textAlign: "center",
        fontWeight: "500",
    },
});