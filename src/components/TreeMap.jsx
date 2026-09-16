import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';


function FlyToTree({ selectedTree }) {
    const map = useMap();

    useEffect(() => {
        if (selectedTree) {
            map.flyTo([selectedTree.lat, selectedTree.lng], 18, { duration: 1.2 })
        }
    }, [selectedTree, map])

    return null
};


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

function TreeMap({ trees, isAddMode, onMapClick, selectedTree }) {
    const centerPosition = [38.5266, 22.3794]

    return (
        <MapContainer
            center={centerPosition}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapClickHandler isAddMode={isAddMode} onMapClick={onMapClick} />
            <FlyToTree selectedTree={selectedTree} />

            {trees.map((tree) => (
                <Marker key={tree.id} position={[tree.lat, tree.lng]}>
                    <Popup>{tree.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default TreeMap;