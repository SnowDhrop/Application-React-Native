import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

import { StateContext } from "./../components/StateContext.js";
import React, { useContext, useEffect, useState } from "react";

import { ScrollView, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ModalScreen() {
	const [photos, setPhotos] = useContext(StateContext);
	const [fileBlob, setFileBlob] = useState(null);

	// useEffect(() => {
	// 	const loadPhotos = async () => {
	// 		try {
	// 			const storedMarkers = await AsyncStorage.getItem("test");
	// 			if (storedMarkers) {
	// 				return storedMarkers;
	// 			} else {
	// 				return [];
	// 			}
	// 		} catch (error) {
	// 			console.log("Error loading markers:", error);
	// 			return [];
	// 		}
	// 	};

	// 	const loadedPhotos = loadPhotos();

	// 	console.log(loadedPhotos);
	// });

	useEffect(() => {
		photos.map((photo) => {
			console.log(photo.photo, "ICI");
		});
	}, []);

	useEffect(() => {
		async function fetchData() {
			const fileBase64 = await AsyncStorage.getItem("test");
			const fileData = atob(fileBase64); // Décoder la chaîne base64 en données binaires
			const contentType = "image/jpeg"; // Remplacez "image/jpeg" par le type MIME correct du fichier que vous avez enregistré
			const blob = new Blob([fileData], { type: contentType }); // Créer un objet Blob à partir des données binaires
			setFileBlob(URL.createObjectURL(blob));
		}

		fetchData();

		console.log(fileBlob);
	}, []);

	// useEffect(() => {
	// 	(async () => {
	// 		const { status } = await MediaLibrary.requestPermissionsAsync();

	// 		if (status !== "granted") {
	// 			Alert.alert(
	// 				"You have to give your persmission to get your photos"
	// 			);
	// 		}

	// 		const albumName = "cours_projet2";
	// 		const album = await MediaLibrary.getAlbumAsync(albumName);

	// 		if (album === null) {
	// 			Alert.alert("Take at least one picture for showing it");
	// 		}

	// 		const yolo = await MediaLibrary.getAssetsAsync({
	// 			album: album.id,
	// 			mediaType: "photo",
	// 			sortBy: [[MediaLibrary.SortBy.creationTime, false]],
	// 		});

	// 		setPhotoGallery(yolo);

	// 		// photoGallery.forEach((photo) => {
	// 		// 	console.log(photo.uri);
	// 		// 	// Faire quelque chose avec chaque photo, par exemple l'afficher dans un composant Image
	// 		// });
	// 	})();
	// }, []);

	return (
		<View style={{ flex: 1 }}>
			<ScrollView
				// style={styles.caroussel}
				style={{
					backgroundColor: "white",
					flex: 1,
				}}
				contentContainerStyle={{
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "space-between",
				}}
			>
				{photos.map((uri, index) => (
					<Image
						key={index}
						source={{ uri }}
						style={{ width: "32%", height: 120, marginBottom: 10 }}
					/>
				))}

				{/* {photos.map((photo, index) => {
					{
						console.log(photo.photo, "ICIIII");
					}
					<Image
						key={index}
						source={photo.photo}
						style={{ width: "32%", height: 120, marginBottom: 10 }}
					/>;
				})} */}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	camera___block: {
		flex: 1,
		// height: "60%",
	},
	camera___view: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	camera___buttons: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		// marginBottom: 20,
	},
	camera___switch: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 50,
		margin: 10,
	},
	camera___button_photo: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 50,
		margin: 10,
	},
	caroussel: {
		position: "absolute",
		top: 0,
		left: 0,
		padding: 10,
	},
	caroussel___photo: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 50,
		margin: 10,
	},
	carousselItem: {
		width: 150,
		height: 150,
		// marginTop: 25,
		// resizeMode: "contain",
	},
});
