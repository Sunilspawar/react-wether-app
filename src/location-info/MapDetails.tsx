export default function MapDetails({ osm }: { osm: string }) {
  const getEmbedUrl = (osmUrl: string) => {
    const info = osmUrl.split("#map=");
    const infoArr = info[1] ? info[1].split("/") : null;
    const lat = infoArr && infoArr[1] ? infoArr[1] : null;
    const lon = infoArr && infoArr[2] ? infoArr[2] : null;
    const zoom = infoArr && infoArr[0] ? infoArr[0] : "17";
    let zoomlevel: number = parseInt(zoom, 10) - 2;

    return `https://maps.google.com/maps?width=100%&height=100%&hl=en&ll=${lat},${lon}&q=+()&ie=UTF8&t=&z=${zoomlevel}&iwloc=B&output=embed`;
  };

  return (
    <div className="map-container">
      <iframe
        title="gmap"
        width="300"
        height="200"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={getEmbedUrl(osm)}
      />
    </div>
  );
}
