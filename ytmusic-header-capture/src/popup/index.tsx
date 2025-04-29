import React from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "./Popup";
import { Provider } from "react-redux"
import { store, persistor } from "../store"
import { AudioPlayerProvider } from "../context/AudioPlayerProvider"
import { PersistGate } from 'redux-persist/integration/react'

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(
<Provider store={store}>
	<PersistGate loading={null} persistor={persistor}>
		<AudioPlayerProvider>
			<Popup/>
		</AudioPlayerProvider>
	</PersistGate>
</Provider>
);
