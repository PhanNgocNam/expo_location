import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import MapboxGL from "@rnmapbox/maps";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoicGhhbm5nb2NuYW0iLCJhIjoiY2xkdWcwbTBnMDVoajN6cXRzeW5qMzR3MyJ9.tNB2ynexTO48NP1wu5Jp4Q"
);

export default function App() {
  const [coords, setCoords] = useState({
    latitude: "x",
    longitude: "y",
  });
  const [sub, setSub] = useState("");
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    if (permission === false) {
      handlePermission();
    }
    if (permission) {
      handleUpdateCoords();
    }

    return () => {
      handleStopTracking();
    };
  }, [coords]);
  const handlePermission = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      return;
    } else {
      setPermission(true);
    }
  };

  const handleUpdateCoords = async () => {
    try {
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (loc) => {
          setCoords({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      );
      setSub(sub);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleStopTracking = async () => {
    await sub.remove();
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: 300,
    width: 300,
  },
  map: {
    flex: 1,
  },
});
