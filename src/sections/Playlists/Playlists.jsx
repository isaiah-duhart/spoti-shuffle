import { usePlaylists } from '../../common/apiCalls'

export default function Playlists() {
	const { playlists, error, loading } = usePlaylists()

    if (loading) return ( <p>Loading...</p>)
    if (error) return (<p>Network error {error.message} </p>)

    console.log(playlists)

	return playlists && (
        <div className="container">
            <p>{playlists.total}</p>
        </div>
    )
}
