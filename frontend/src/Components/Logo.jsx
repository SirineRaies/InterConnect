import logoIcon from "../assets/logo.png";

function Logo () {

    return(
        <div style={{display:"flex", flexDirection:"row",gap:"10px", alignItems:"center"}}>
        <img src={logoIcon} alt="Logo Icon" style={{width: '55px', height: '75px'}} />
        </div>
    )
}
export default Logo;
