function chargerAudio(nomAudio) {

    let langue = localStorage.getItem("langue") || "fr";

    let sourceAudio = document.getElementById("audio-source");

    let lecteur = document.getElementById("lecteur-audio");


    sourceAudio.src = "../audios/" + langue + "/" + nomAudio + ".wav";


    lecteur.load();

}