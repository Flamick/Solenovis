const wrapper = document.querySelector('.wrapper'),
      nowPlaying = wrapper.querySelector('.now-playing'),
      musicImg = wrapper.querySelector('.img-area img'),
      musicName = wrapper.querySelector('.song-details .name'),
      musicArtist = wrapper.querySelector('.song-details .artist'),
      mainAudio = wrapper.querySelector('#main-audio'),
      mainAudioDuration = wrapper.querySelector('.duration'),
      PlayPauseBtn = wrapper.querySelector('.play-pause'),
      prevBtn = wrapper.querySelector('#prev-song'),
      nextBtn = wrapper.querySelector('#next-song'),
      progressArea = wrapper.querySelector('.progress-area'),
      progressBar = progressArea.querySelector(".progress-bar"),
      musicList = wrapper.querySelector('.music-list'),
      showMoreBtn = wrapper.querySelector('#more-music'),
      hideMusicBtn = wrapper.querySelector('#close');
    
let musicIndex = 1;

// Calling loadMusic function once window is loaded
window.addEventListener('load', () => {
    loadMusic(musicIndex);
    playingNow();
    setTotalDuration();
});

function setTotalDuration() {
    const onLoadSong = document.querySelector('.playing audio');
    const onLoadSongDuration = onLoadSong.duration;
    let totalMin = Math.floor(onLoadSongDuration / 60);
    let totalSec = Math.floor(onLoadSongDuration % 60);
    if(totalSec < 10) {
        totalSec = `0${totalSec}`;
    }
    mainAudioDuration.innerText = `${totalMin}:${totalSec}`;
}

// loadMusic function
function loadMusic(indexNumb) {
    nowPlaying.innerText = 'Playing song ' + (musicIndex) + ' of ' + allMusic.length;
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `./img/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `./music/${allMusic[indexNumb - 1].src}.mp3`;
}

// playMusic function
function playMusic() {
    wrapper.classList.add('paused');
    PlayPauseBtn.querySelector('i').innerText = 'pause';
    mainAudio.play();
}

// pauseMusic
function pauseMusic() {
    wrapper.classList.remove('paused');
    PlayPauseBtn.querySelector('i').innerText = 'play_arrow';
    mainAudio.pause();
}

// nextMusic function
function nextMusic() {
    // increase music index by 1
    musicIndex ++;
    // if music index is greater than the array length then it will reset to 1
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// prevMusic function
function prevMusic() {
    // decrease music index by 1
    musicIndex --;
    // if music index is less than 1 then it will set it to the array length and play last song
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// play or music button event
PlayPauseBtn.addEventListener('click', () => {
    const isMusicPaused = wrapper.classList.contains('paused');
    // if isMusicPause is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

// nextBtn click event
nextBtn.addEventListener('click', () => {
    nextMusic();
})

// prevBtn click event
prevBtn.addEventListener('click', () => {
    prevMusic();
})

// update progress bar with current time
mainAudio.addEventListener('timeupdate', (e) => {
    const currentTime = e.target.currentTime; 
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration * 100);
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector('.current');
    let musicDuration = wrapper.querySelector('.duration');

    mainAudio.addEventListener('loadeddata', () => {
        // update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    // update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song current time according to the progress bar width
progressArea.addEventListener('click', (e) => {
    // getting width of progress bar
    let progressWidthval = progressArea.clientWidth;
    // getting offset x value
    let clickedOffSetX = e.offsetX;
    // getting song total duration
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// repeat, shuffle button change
const repeatBtn = wrapper.querySelector('#repeat-playlist');
repeatBtn.addEventListener('click', () => {
    // grab the innerText of the icon and change accordingly
    let getText = repeatBtn.innerText;
    switch(getText) {
        // if the icon is repeat turn to repeat one
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute('title', 'Song looped');
            break;
            // if icon is repeat one, turn to shuffle
        case 'repeat_one':
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute('title', 'Playback shuffle');
            break;
            // if icon is shuffle turn to repeat
        case 'shuffle':
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute('title', 'Playlist looped');
            break;
    }
});

let isShuffled = false;

// repeat/shuffle button after song ends
mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerText;

    // set button function based on the icon
    switch(getText) {
        // if the icon is repeat
        case "repeat":
            nextMusic();
            break;
            // if icon is repeat one
        case 'repeat_one':
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
            // if icon is shuffle
        case 'shuffle':
            if (!isShuffled) {
                shuffleArray(allMusic);
                isShuffled = true;
                musicIndex ++;
                console.log(allMusic);
                console.log(musicIndex);
            }   else if(musicIndex === 5)  {
                shuffleArray(allMusic);
                musicIndex = 1;
                console.log(allMusic);
                console.log(musicIndex);
            }   else   {
                nextMusic();
                console.log(musicIndex);
            }

        //     let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
        //     do {
        //         randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
        //         // this look runs until the next random number isnt the same as the current music index
        //     }   while(musicIndex == randomIndex);
        //     musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
});

showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle('show');
});

hideMusicBtn.addEventListener('click', () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector('ul');

// Create li according to array length
for(let i = 0; i < allMusic.length; i++) {
    // passing in song name
    let liTag = `
    <li li-index='${i + 1}'>
        <div class="row">
            <span>${allMusic[i].name}</span>
            <p>${allMusic[i].artist}</p>
        </div>
        <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
        <span id="${allMusic[i].src}"  class="audio-duration">3:40</span>
    </li>
    `;
    ulTag.insertAdjacentHTML('beforeend', liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener('loadeddata', () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        // adding t-duration attribute to grab on below
        liAudioDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`);
    });
}

// play song on song list click
const allLiTags = ulTag.querySelectorAll('li');
function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector('.audio-duration');
        // Removing playing class from all other li except the one that's clicked
        if(allLiTags[j].classList.contains('playing')) {
            allLiTags[j].classList.remove('playing');
            // getting the t-duration attribute to set the innerText
            let adDuration = audioTag.getAttribute('t-duration');
            audioTag.innerText = adDuration;
        }
        // if there is an li tag which li-index is equal to musicIndex
        // then this music is playing now and gets styled
        if(allLiTags[j].getAttribute('li-index') == musicIndex) {
            allLiTags[j].classList.add('playing');
            audioTag.innerText = 'Playing';
        }
    
        // adding onclick attribute in all li tags
        allLiTags[j].setAttribute('onclick', 'clicked(this)');
    }
}

// play song on li click
function clicked(element) {
    // getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute('li-index');
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}