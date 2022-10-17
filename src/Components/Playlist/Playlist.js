import "./Playlist.css";
import React from "react";
import Tracklist from "../TrackList/TrackList.js";

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    handleNameChange(e) {
        this.props.onNameChange(e.taget.value);
    }
    render() {
        return (<div className="Playlist" >
            <input defaultValue={"New Playlist"} />
            <Tracklist tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} onChange={this.handleNameChange} />
            <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
        </div>)
    }
}
export default Playlist;