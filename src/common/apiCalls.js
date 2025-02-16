import { useEffect, useState } from 'react'

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

		async function profileCached() {
			const cachedProfile = window.sessionStorage.getItem('profile')
			let cached = false
			try {
				// TODO look into: I've seen this both ways (null and 'null') - not sure why
				if (cachedProfile !== 'null' && cachedProfile !== null && !ignore) {
					const profileObj = await JSON.parse(cachedProfile)
					setProfile(profileObj)
					setLoading(false)
					cached = true
				}
			} catch (error) {
				setError(error)
			} finally {
				return cached
			}
		}

		async function fetchData() {
			if (await profileCached()) {
				return
			}
			try {
				const loggedIn = window.sessionStorage.getItem('loggedIn')
				// TODO look into: I've seen this both ways - not sure why
				if (loggedIn === null || loggedIn === 'null') {
					const loginResult = await fetch('http://localhost:8000/api/login', {
						method: 'GET',
						mode: 'cors',
						credentials: 'include',
					})

					if (!loginResult.ok) {
						throw new Error(
							`getAccessToken: HTTP Error: Status ${loginResult.status}`
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
					'http://localhost:8000/api/profile',
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
				const playlistsResult = await fetch(
					'http://localhost:8000/api/playlists',
					{
						method: 'GET',
						mode: 'cors',
						credentials: 'include',
					}
				)

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

    return { playlists, error, loading}
}
