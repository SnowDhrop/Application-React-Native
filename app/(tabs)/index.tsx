import { StatusBar } from "expo-status-bar";
import { Camera, CameraType, CameraCapturedPicture } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import {
	Button,
	StyleSheet,
	TouchableOpacity,
	Image,
	ScrollView,
	Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";

import { StateContext } from "./../../components/StateContext.js";
import React, { useContext } from "react";

import * as Location from "expo-location";

export default function TabOneScreen() {
	const [type, setType] = useState(CameraType.back);
	//prettier-ignore
	const [permissionCamera, requestPermissionCamera] = Camera.useCameraPermissions();
	const [photoUri, setPhotoUri] = useState(null);
	const cameraRef = useRef(null as any);
	// const [photos, setPhotos] = useState<CameraCapturedPicture[]>([] as any);
	//prettier-ignore
	const [photos, setPhotos, photoLocations, setPhotoLocations] = useContext(StateContext);
	//prettier-ignore
	const [permissionResponseMediaLibrary, requestPermissionMediaLibrary] = MediaLibrary.usePermissions();
	const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
	const [isCameraReady, setIsCameraReady] = useState(false);

	// if (!permissionCamera) {
	// 	Alert.alert(
	// 		"Permission required",
	// 		"You need to grant permission to access to your camera",
	// 		[{ text: "OK" }]
	// 	);
	// }

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();
			requestPermissionCamera(status === "granted");
		})();
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

	// 		setPhotos(yolo);
	// 	})();
	// }, []);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestPermissionsAsync();
			if (status !== "granted") {
				Alert.alert("We need your permission to take the location");
			}
		})();
	}, []);

	const onCameraReady = () => {
		setIsCameraReady(true);
	};

	function toggleCameraType() {
		setType((current) =>
			current === CameraType.back ? CameraType.front : CameraType.back
		);
	}

	const saveToGallery = async (photoUri: any) => {
		try {
			const mediaPermission =
				await MediaLibrary.requestPermissionsAsync();

			if (mediaPermission.granted) {
				const asset = await MediaLibrary.createAssetAsync(photoUri);
				const album = await MediaLibrary.getAlbumAsync("cours_projet2");

				if (album === null) {
					await MediaLibrary.createAlbumAsync(
						"cours_projet2",
						asset,
						false
					);
				} else {
					await MediaLibrary.addAssetsToAlbumAsync(
						[asset],
						album,
						false
					);
				}

				const fileInfo = await FileSystem.getInfoAsync(photoUri);
				const fileBase64 = await FileSystem.readAsStringAsync(
					fileInfo.uri,
					{ encoding: "base64" }
				);

				await AsyncStorage.setItem("test", fileBase64);
			} else {
				Alert.alert(
					"Permission required",
					"You need to grant permission to save photos to your library",
					[{ text: "OK" }]
				);
			}
		} catch (error) {
			console.error("Error saving photo to gallery:", error);
		}
	};

	async function takePicture() {
		if (cameraRef.current) {
			const options = { quality: 0.5, base64: true };
			const photo = await cameraRef.current.takePictureAsync(options);
			setPhotoUri(photo.uri);

			setPhotos((prevPhotos) => [photo.uri, ...prevPhotos]);

			saveToGallery(photo.uri);

			const location = await Location.getCurrentPositionAsync();

			// setPhotos((prevPhotos) => [
			// 	{ photo: photo.uri, location: location },
			// 	...prevPhotos,
			// ]);

			setPhotoLocations([...photoLocations, location.coords]);

			// Alert.alert("YOLO");
		}
	}

	const toggleFlash = (value: string) => {
		setFlashMode(value);
	};
	return (
		<View>
			<Camera
				// style={styles.camera___block}
				style={{ height: "100%" }}
				type={type}
				ref={cameraRef}
				flashMode={flashMode}
				onCameraReady={onCameraReady}
			>
				<TouchableOpacity
					// style={styles.camera___switch}
					style={{
						backgroundColor: "white",
						padding: 20,
						borderRadius: 50,
						alignSelf: "center",
						marginTop: 40,
					}}
					onPress={toggleCameraType}
				>
					<Text style={{ color: "black" }}>Flip</Text>
				</TouchableOpacity>
				<View
					// style={styles.camera___view}
					style={{
						position: "absolute",
						bottom: 0,
						backgroundColor: "transparent",
						width: "100%",
					}}
				>
					<View
						// style={styles.camera___buttons}
						style={{
							display: "flex",
							flexDirection: "row",
							backgroundColor: "transparent",
							width: "100%",
						}}
					>
						<TouchableOpacity
							// style={styles.camera___button_photo}
							style={{
								backgroundColor: "white",
								padding: 30,
								borderRadius: 50,
								margin: 10,
								marginLeft: "42%",
								borderWidth: 2,
								borderColor: "black",
							}}
							onPress={takePicture}
						></TouchableOpacity>

						{/* <TouchableOpacity
								// style={styles.camera___button_photo}
								style={{
									backgroundColor: "white",
									padding: 30,
									borderRadius: 50,
									margin: 10,
									marginLeft: "42%",
									borderWidth: 2,
									borderColor: "black",
								}}
								// onPress={toggleFlash()}
							></TouchableOpacity> */}

						{photoUri && (
							<Image
								source={{ uri: photoUri }}
								// style={styles.caroussel___photo}
								style={{
									backgroundColor: "white",
									padding: 20,
									borderRadius: 50,
									margin: 10,
									alignSelf: "flex-end",
									marginRight: "auto",
								}}
							/>
						)}
					</View>
				</View>
			</Camera>
			<StatusBar style='auto' />
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
	},
});
