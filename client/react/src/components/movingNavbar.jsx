const MovingNavbar = () =>{
    const notice = "The analyze image api for getting nutrients is disabled due to its high cost on AWS ECS, please view the demo video here - https://youtu.be/AKqM69CaISE?si=iOGqPhYjPkt7-lpJ"

    return (
        <div className="h-7 z-50 bg-red-600 fixed top-0 left-0 w-screen overflow-hidden text-white">
            <a
                href="https://youtu.be/AKqM69CaISE?si=iOGqPhYjPkt7-lpJ"
                target="_blank"
                rel="noreferrer"
                className="moving-navbar-track flex h-full w-max items-center whitespace-nowrap text-sm font-medium"
            >
                <span className="px-10">{notice}</span>
                <span className="px-10" aria-hidden="true">{notice}</span>
            </a>
        </div>
    )
}

export default MovingNavbar
