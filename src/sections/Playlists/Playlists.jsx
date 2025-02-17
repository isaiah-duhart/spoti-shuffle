import styles from './PlaylistsStyles.module.css'
import { useEffect } from 'react'
import { usePlaylists } from '../../common/apiCalls'
import PlaylistCard from './PlaylistCard'

export default function Playlists({ updatePlaylist }) {
	const { playlists, error, loading } = usePlaylists()

	useEffect(() => {
		if (playlists && playlists.items.length > 0)
			updatePlaylist(playlists.items[0].id)
	}, [playlists])

	if (loading) return <p>Loading...</p>
	if (error) return <p>Network error {error.message} </p>

	return (
		playlists && (
			<div className={styles.container}>
				{playlists.items.map((playlist) => {
					return (
						<PlaylistCard
							key={playlist.id}
							playlist={playlist}
							updatePlaylist={updatePlaylist}
						/>
					)
				})}
			</div>
		)
	)
}
