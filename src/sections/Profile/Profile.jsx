import styles from './ProfileStyles.module.css'
import { useLogin } from '../../common/apiCalls'
import Playlists from '../Playlists/Playlists'
import PlaylistDetails from '../PlaylistDetails/PlaylistDetails'
import { useState } from 'react'

export default function Profile() {
	const [activePlaylistId, setActivePlaylistId] = useState(null)
	
	const { profile, error, loading } = useLogin()

	if (loading) return <p>Loading...</p>
	if (error) return <p>A network error was encountered: {error.message}</p>

	const viewSpotifyProfile = () => {
		window.open(profile.external_urls.spotify, '_blank')
	}

	return (
		profile && (
			<div className={styles.pageContainer}>
				<header>
					<h1>Spotify Playlists</h1>
					<nav>
						<button
							className={styles.profileLink}
							type='button'
							onClick={viewSpotifyProfile}
						>
							{profile.display_name}
						</button>
					</nav>
				</header>
				<div className={styles.playlistsContainer}>
					<Playlists updatePlaylist={setActivePlaylistId}/>
				</div>
				<div className={styles.playlistDetailContainer}>
					<PlaylistDetails playlistId={activePlaylistId}/>
				</div>
			</div>
		)
	)
}
