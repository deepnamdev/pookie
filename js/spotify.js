console.log("lets write javascript")
let currentsong = new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "invalid input";

    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    const formattedMinutes = String(minutes).padStart(2, '0');
    const fromattedSeconds = String(remainingSeconds).padStart(2, '0')
    return `${formattedMinutes}:${fromattedSeconds}`;
}

//"show all the song in the playlist"
async function getsongs(folder) {
    currfolder = folder
    //sabse pehle humne ek variable banaya usme humne humhari songs ki api ko fetch kara diya "

    // "now theres a change ab getsongs folder ka naam lega ki kis folder ko call karna hai "
    let a = await fetch(`/${folder}/`)


    let response = await a.text();  // fir ek response naam ka variable bana kar usme a k andar jo bhi hai usko text me convert kara denge "
    //"is step me saare song table me aaye hai toh inko karna padega parse "

    let div = document.createElement("div")
    //fir ek div naam ka variable banayenge aur usme ek div element create karenege "
    div.innerHTML = response;
    //jo humhara div hai uski inner html ko hum response se change kar denge"

    let as = div.getElementsByTagName("a")
    // firse ek as naam ka variable banayenge usko hum target karenege tag name a se "
    // isme a ka matlab a.href se hai baaki itna noob nahi hai tu 


    songs = [];  // idhar humne ek blank array banaya hai "
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // get all songs in  the playlist

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
            
                            <img class="invert" src="img/muysic.svg" alt="">
                            <div class="musicinfo">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Meg-c</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert " src="img/play.svg" alt="" height="30px">
                            </div>
           </li>`;
    }
    // "attach the event listner to each song"
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".musicinfo").firstElementChild.innerHTML)
            playMusic(e.querySelector(".musicinfo").firstElementChild.innerHTML.trim())
        })
    })
 return songs
}

let playMusic = (track, pause = false) => {
    currentsong.src = `${currfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.Src = "img/play.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function dispplayAlbums() {
    // "now theres a change ab getsongs folder ka naam lega ki kis folder ko call karna hai "
    let a = await fetch(`/songs/`)


    let response = await a.text();  // fir ek response naam ka variable bana kar usme a k andar jo bhi hai usko text me convert kara denge "
    //"is step me saare song table me aaye hai toh inko karna padega parse "

    let div = document.createElement("div")
    //fir ek div naam ka variable banayenge aur usme ek div element create karenege "
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let CardContainer = document.querySelector(".CardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs")) {
            let folder = (e.href.split("/").slice(-2)[0])
            // get the metadata of the folder 
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            CardContainer.innerHTML = CardContainer.innerHTML + ` <div data-folder="${folder}" class="card border">
                        <div  class="play">
                            <div style="width: 28px; height: 28px; background-color: #00f000;
                            border-radius: 50%; padding: 4px; display: flex; align-items: center; justify-content: center;">
                            <svg width="16" height="16" viewBox=" 0 0 24 24 " fill="black" xlmns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>

                              
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.discription}</p>
                    </div>`
        }
        Array.from(document.getElementsByClassName("card")).forEach(e => { 
            e.addEventListener("click", async item => {
                console.log("Fetching Songs")
                songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
                playMusic(songs[0])
    
            })
        })
    }
}







async function main() {
    // get all the list of the song

    await getsongs("songs/songlist1")
    playMusic(songs[0], true)

    // display all the albums dynamically

    dispplayAlbums()



    // // play the first song
    // var audio = new Audio(songs[1]);
    // audio.play()

    // audio.addEventListener("loadeddata ",()=>{
    //     console.log(audio.duration , audio.currentSrc ,audio.currentTime)
    // //the duration variable now holds the duration(in second ) of audio clip
    // })

    // attach an envent listner to play , next previos

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    // listen for time update event 
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime )
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    // add an event listner to an seek bar 

    document.querySelector(".seekbar").addEventListener("click", E => {
        let percent = (E.offsetX / E.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // add event listner to an hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    // add event listner for close button 

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add an event listner for previos and next
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

        // console.log(currentsong.src.split("/").slice(-1)[0]);
        console.log("nextclicked")
    })

    previous.addEventListener("click", () => {
        console.log("perv clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // add an evvent listner to a volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e, e.target, e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100
    })

    // console.log(currentsong);


 // event listner to mute the track 

document.querySelector(".volume> img").addEventListener("click", e=>{
    // console.log(e.target)
    if (e.target.src.includes ("volume.svg")) {
        e.target.src = e.target.src.replace("volume.svg" , "mute.svg")
        currentsong.volume = 0 ;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        
        
    }
    else{
        e.target.src = e.target.src.replace( "mute.svg" , "volume.svg")
        currentsong.volume = 10/100 ;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10
    }
})




}
main()