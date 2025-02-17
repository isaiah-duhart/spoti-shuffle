import styles from './PlaylistCardStyles.module.css'

export default function PlaylistCard({ playlist, updatePlaylist }) {
	const selectPlaylist = () => {
		updatePlaylist(playlist.id)
	}

	return (
		<button onClick={selectPlaylist} className={styles.playlistCard}>
			<img src={playlist.images[0].url} alt='Playlist Image' />
			<div className={styles.playlistDetails}>
				<p className={styles.playlistName}>{playlist.name}</p>
				<p className={styles.playlistOwner}>{playlist.owner.display_name}</p>
			</div>
		</button>
	)
}
