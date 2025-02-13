import { useEffect, useState } from 'react'

const useProfileData = () => {
	const [profile, setProfile] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let ignore = false

		async function profileCached() {
			const cachedProfile = window.sessionStorage.getItem('profile')
			let cached = false
			try {
				if (cachedProfile !== "null" && !ignore) {
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
				if (window.sessionStorage.getItem('loggedIn') === "null") {
					const loginResult = await fetch('http://localhost:8000/api/login', {
						method: 'GET',
						mode: 'cors',
					})

					if (!loginResult.ok) {
						throw new Error(
							`getAccessToken: HTTP Error: Status ${loginResult.status}`
						)
					}
					const loginJson = await loginResult.json()

					if (ignore) {
						return
					}

                    window.sessionStorage.setItem('loggedIn', "true")

					window.location.assign(loginJson.location)
				}
                // Api to verify i am logged in when i come back via redirect????
				const profileResult = await fetch(
					'http://localhost:8000/api/getProfile',
					{
						method: 'GET',
						mode: 'cors',
					}
				)

				const profileJson = await profileResult.json()

				if (ignore) {
					return
				}

				setProfile(profileJson)
				window.sessionStorage.setItem('profile', JSON.stringify(profile))
			} catch (error) {
				setError(error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()

		return () => {
			ignore = true
		}
	}, [])

	return { profile, error, loading }
}

export default function Profile() {
	const { profile, error, loading } = useProfileData()

	if (loading) return <p>Loading...</p>
	if (error) return <p>A network error was encountered: {error.message}</p>

	return (
		profile && (
			<>
				<h1>Spotify Profile Data</h1>

				<section id='profile'>
					<h2>Logged in as {profile.display_name}</h2>
					<ul>
						<li>User ID: {profile.id}</li>
						<li>Email: {profile.email}</li>
						<li>
							<a href={profile.external_urls.spotify}>Spotify URI</a>
						</li>
						<li>
							<a href={profile.href}>Spotify Link</a>
						</li>
					</ul>
				</section>
			</>
		)
	)
}
