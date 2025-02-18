import styles from './PlaylistDetailsCardStyles.module.css'

export default function PlaylistDetailsCard({ item }) {
    return item && (
        <div className={styles.playlistDetailsCard}>
            <img className={styles.trackImage} src={item.track.album.images[0].url} alt={`${item.track.name} image`} />
            <div className={styles.trackNameAndArtist}>
                <p className={styles.trackName}>{item.track.name}</p>
                <p className={styles.trackArtists}>{item.track.artists.map((artist, index, arr) => {return (index < arr.length - 1) ? `${artist.name}, ` : artist.name})}</p>
            </div>
        </div>
    )
}
