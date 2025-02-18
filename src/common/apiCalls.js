import { useEffect, useState } from 'react'

const apiUrl = 'http://localhost:8000'

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

async function retryFetch(url, options, interval, attempts) {
	let result = null
	for (let i = 0; i < attempts; i++) {
		result = await fetch(url, options).catch()
		if (result.ok) {
			break
		}
		await delay(interval)
	}
	return result
}

export const useLogin = () => {
	const [profile, setProfile] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let ignore = false

		async function fetchData() {
			try {
				const loggedIn = window.sessionStorage.getItem('loggedIn')
				// TODO look into: I've seen this both ways - not sure why
				if (loggedIn === null || loggedIn === 'null') {
					const loginResult = await fetch(`${apiUrl}/api/login`, {
						method: 'GET',
						mode: 'cors',
						credentials: 'include',
					})

					if (!loginResult.ok) {
						throw new Error(
							`login: HTTP Error: Status ${loginResult.status}`
						)
					}
					const loginJson = await loginResult.json()

					if (ignore) return

					window.sessionStorage.setItem('loggedIn', 'true')
					window.location.assign(loginJson.location)
				}

				if (ignore) return

				// Need to wait for spotifty api callback to backend (for access token) to getProfile, try a couple of times
				const profileResult = await retryFetch(
					`${apiUrl}/api/profile`,
					{
						method: 'GET',
						mode: 'cors',
						credentials: 'include',
					},
					100,
					5
				)

				if (profileResult === null) {
					throw new Error('Failed to fetch profile')
				}

				const profileJson = await profileResult.json()

				if (ignore) return

				setProfile(profileJson)
				window.sessionStorage.setItem('profile', JSON.stringify(profile))
			} catch (error) {
				setError(error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()

		// TODO look into using abort controller instead of this bool so i can get rid of all these ugly checks
		return () => {
			ignore = true
		}
	}, [])

	return { profile, error, loading }
}

export const usePlaylists = () => {
	const [playlists, setPlaylists] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let ignore = false
		async function fetchPlaylists() {
			try {
				const playlistsResult = await fetch(`${apiUrl}/api/playlists`, {
					method: 'GET',
					mode: 'cors',
					credentials: 'include',
				})

				if (!playlistsResult.ok) {
					throw new Error('Failed to fetch playlists')
				}

				const playlistJson = await playlistsResult.json()

				if (ignore) return

				setPlaylists(playlistJson)
			} catch (error) {
				setError(error)
			} finally {
				setLoading(false)
			}
		}

		fetchPlaylists()

		return () => (ignore = true)
	}, [])

	return { playlists, error, loading }
}

export const usePlaylistDetails = (playlistId) => {
	const [playlistDetails, setPlaylistDetails] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		let ignore = false
		async function fetchPlaylistDetails() {
			try {
				// TODO should we display error here?
				if (playlistId == null) return

				const playlistDetailsResult = await fetch(
					`${apiUrl}/api/playlist?playlistId=${playlistId}`,
					{
						method: 'GET',
						mode: 'cors',
						credentials: 'include',
					}
				)

				if (!playlistDetailsResult.ok) {
					throw new Error('Failed to fetch playlist details')
				}

				const playlistDetails = await playlistDetailsResult.json()

				if (ignore) return

				setPlaylistDetails(playlistDetails)
			} catch (error) {
				setError(error)
			} finally {
				setLoading(false)
			}
		}

		fetchPlaylistDetails()

		return () => (ignore = true)
	}, [playlistId])

	return { playlistDetails, loading, error }
}
