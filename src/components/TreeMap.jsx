import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function TreeMap({ trees }) {
    const centerPosition = [38.5266, 22.3794]; // Amfissa

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

            {trees.map((tree) => (
                <Marker key={tree.id} position={[tree.lat, tree.lng]}>
                    <Popup>{tree.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default TreeMap;