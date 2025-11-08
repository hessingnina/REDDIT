import './Home.css'
import MagicBento from '../../components/MagicBento/MagicBento'
function Home() {
  return (
    <div id="hero">
      <div id="description">
        <h2 id="big-header">Berkeley Reddit Analytics</h2>
        <h3 id="small-header">Real-Time Reddit Trends, Local Berkeley Insights.</h3>
      </div>
      <MagicBento 
        id="magic-bento"
        textAutoHide={true}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={true}
        enableMagnetism={true}
        clickEffect={true}
        spotlightRadius={300}
        particleCount={12}
        glowColor="132, 0, 255"
      />
    </div>
  );
}

export default Home;