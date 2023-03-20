import { StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";

import * as Location from "expo-location";

import MapView, { Marker } from "react-native-maps";
import { StateContext } from "../../components/StateContext";

import React, { useContext, useEffect } from "react";

export default function TabTwoScreen() {
	//prettier-ignore
	const [photos, setPhotos, photoLocations, setPhotoLocations] = useContext(StateContext);

	// let photoTest = JSON.parse(photoLocations);

	return (
		<>
			<MapView
				style={{ flex: 1 }}
				initialRegion={{
					latitude: 43.6108,
					longitude: 3.8767,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
			>
				{photoLocations.map((location) => (
					<Marker
						// key={`${location.latitude}-${location.longitude}`}
						coordinate={{
							latitude: location.latitude,
							longitude: location.longitude,
						}}
					/>
				))}
			</MapView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
