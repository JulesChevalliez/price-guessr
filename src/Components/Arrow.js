export default function Arrow(props){
    if(props.color === "green"){
        return(
            <svg className="green" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 15C14.5523 15 15 14.5523 15 14L15 5C15 4.44772 14.5523 4 14 4C13.4477 4 13 4.44772 13 5L13 13L5 13C4.44772 13 4 13.4477 4 14C4 14.5523 4.44772 15 5 15L14 15ZM0.292893 1.70711L13.2929 14.7071L14.7071 13.2929L1.70711 0.292893L0.292893 1.70711Z" fill="url(#paint0_linear_25_50)"/>
                <defs>
                    <linearGradient id="paint0_linear_25_50" x1="1" y1="1" x2="14.4643" y2="14.4643" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#39DB49"/>
                        <stop offset="1" stop-color="#78FF85"/>
                    </linearGradient>
                </defs>
            </svg>
        )
    }else{
        return (
            <svg className="blue" width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.939341 10.9393C0.353554 11.5251 0.353554 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97918 12.6066 1.3934C12.0208 0.80761 11.0711 0.80761 10.4853 1.3934L0.939341 10.9393ZM30 10.5L2 10.5L2 13.5L30 13.5L30 10.5Z" fill="url(#paint0_linear_24_39)"/>
                <defs>
                    <linearGradient id="paint0_linear_24_39" x1="30" y1="12" x2="0.999999" y2="12" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#5E50FB"/>
                        <stop offset="1" stopColor="#65DAFF"/>
                    </linearGradient>
                </defs>
            </svg>
        )
    }
    
}