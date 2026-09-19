import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import oliveIconImg from '../assets/olive_icon.png'

// custom icon
const oliveTreeIcon = L.icon({
    iconUrl: oliveIconImg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
})
function FlyToTree({ selectedTree }) {
    const map = useMap();

    useEffect(() => {
        if (selectedTree) {
            map.flyTo([selectedTree.lat, selectedTree.lng], 18, { duration: 1.2 })
        }
    }, [selectedTree, map])

    return null
};

function FlyToCoords({ coords }) {
    const map = useMap()

    useEffect(() => {
        if (coords) {
            map.flyTo([coords.lat, coords.lng], 19, { duration: 1.2 })
        }
    }, [coords, map])

    return null
}


function MapClickHandler({ isAddMode, onMapClick }) {
    useMapEvents({
        click(e) {
            if (isAddMode) {
                onMapClick(e.latlng)
            }
        },
    })
    return null;
}

function TreeMap({ trees, isAddMode, onMapClick, selectedTree, onDeleteTree, myLocation }) {
    const centerPosition = [38.5266, 22.3794];

    return (
        <MapContainer
            center={centerPosition}
            zoom={15}
            maxZoom={19}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Street Map">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        maxZoom={19}
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Satellite">
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='Tiles &copy; Esri'
                        maxZoom={19}
                    />
                </LayersControl.BaseLayer>
            </LayersControl>

            <MapClickHandler isAddMode={isAddMode} onMapClick={onMapClick} />
            <FlyToTree selectedTree={selectedTree} />
            <FlyToCoords coords={myLocation} />

            {trees.map((tree) => (
                <Marker key={tree.id} position={[tree.lat, tree.lng]} icon={oliveTreeIcon}>
                    <Popup>
                        <div className="flex flex-col gap-1">
                            <span className="font-medium">{tree.name}</span>
                            <button
                                onClick={() => onDeleteTree(tree.id)}
                                className="text-red-600 text-sm hover:underline text-left"
                            >
                                Delete tree
                            </button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default TreeMap;