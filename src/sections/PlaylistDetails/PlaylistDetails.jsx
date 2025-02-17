import styles from './PlaylistDetailsStyles.module.css'
import { usePlaylistDetails } from '../../common/apiCalls'
import PlaylistDetailsCard from './PlaylistDetailsCard'

export default function PlaylistDetails({ playlistId }) {
	const { playlistDetails, loading, error } = usePlaylistDetails(playlistId)

	if (loading) return <p>loading...</p>
	if (error) return <p>Network error retreiving playlist {error.message}</p>

	return playlistDetails && (
        <div className={styles.detailsContainer}>
            {playlistDetails.items.map(item => {return <PlaylistDetailsCard key={item.track.id} item={item}/>})}
        </div>)
}
