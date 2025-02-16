import styles from './PlaylistsStyles.module.css'
import { usePlaylists } from '../../common/apiCalls'
import PlaylistCard from './PlaylistCard'

export default function Playlists() {
	const { playlists, error, loading } = usePlaylists()

    if (loading) return ( <p>Loading...</p>)
    if (error) return (<p>Network error {error.message} </p>)

    console.log(playlists)

	return playlists && (
        <div className={styles.container}>
            {playlists.items.map(playlist => {return <PlaylistCard key={playlist.id} playlist={playlist} />})}
        </div>
    )
}
