import logoIcon from "../assets/logo.png";
import logoText from "../assets/LogoText.png";

function LogoText () {

    return(
        <div style={{display:"flex", flexDirection:"row",gap:"10px", alignItems:"center"}}>
        <img src={logoIcon} alt="Logo Icon" style={{width: '55px', height: '75px'}} />
        <img src={logoText} alt="Logo Text" style={{width: '240px', height: '25px'}} />
        </div>
    )
}
export default LogoText;
