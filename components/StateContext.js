import React, { useState, createContext } from "react";
import { Camera, CameraType, CameraCapturedPicture } from "expo-camera";

export const StateContext = createContext();

export const StateProvider = (props) => {
	// const [photos, setPhotos] = useState<CameraCapturedPicture[]>([] as any);

	const [photos, setPhotos] = useState([]);
	const [photoLocations, setPhotoLocations] = useState([]);

	const contextValue = [photos, setPhotos, photoLocations, setPhotoLocations];

	return (
		<StateContext.Provider
			// value={[photos, setPhotos]}
			value={contextValue}
		>
			{props.children}
		</StateContext.Provider>
	);
};
