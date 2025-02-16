import styles from './PlaylistCardStyles.module.css'

export default function PlaylistCard({ playlist }) {
	console.log(playlist.name)
	return (
		<div className={styles.playlistCard}>
			<img src={playlist.images[0].url} alt='Playlist Image' />
			<div className={styles.playlistDetails}>
				<p className={styles.playlistName}>{playlist.name}</p>
				<p className={styles.playlistOwner}>{playlist.owner.display_name}</p>
			</div>
		</div>
	)
}
