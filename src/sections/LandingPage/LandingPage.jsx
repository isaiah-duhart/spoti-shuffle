import { useNavigate } from "react-router-dom"
import styles from './LandingPageStyles.module.css'

export default function LandingPage() {
	let navigate = useNavigate()
	const moveToProfile = () => {
		let path = `profile`
		navigate(path)
	}

	return (
		<div className={styles.container}>
			<h1>Ready to revolutionize your music listening experience?</h1>
			<button type='button' onClick={moveToProfile}>
				Connect To Spotify
			</button>
		</div>
	)
}
