import { Magic } from "magic-sdk";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const magic = new Magic("pk_live_9CECDC3B1BA34ADB");

function HomePage() {
  const history = useHistory();

  useEffect(() => {
    async function fetchUserData() {
      const userMetadata = await magic.user.getMetadata();
      alert(JSON.stringify(userMetadata, null, 2));
    }
    fetchUserData();
  }, []);
  return <div>Hello Home</div>;
}

export default HomePage;
