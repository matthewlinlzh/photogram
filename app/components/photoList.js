import React from "react";
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from "react-native";
import { f, database, auth, storage } from "../../config/config.js";


export default class photoList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            photo_feed: [],
            refresh: false,
            loading: true,
            empty: false
        }
    }

    componentDidMount = () => {
        const { isUser, userId } = this.props;

        if (isUser == true) {
            this.loadFeed(userId);
        }
        else {
            this.loadFeed('')
        }
    }

    pluarlCheck = (s) => {

        if (s == 1) {
            return ' ago';
        } else {
            return 's ago';
        }
    }

    timeConverter = (timedtamp) => {
        var a = new Date(timedtamp * 1000);
        var second = Math.floor((new Date() - a) / 1000);

        var interval = Math.floor(second / 31536000);
        if (interval > 1) {
            return interval + ' year' + this.pluarlCheck(interval);
        }

        interval = Math.floor(second / 2592000);
        if (interval > 1) {
            return interval + ' month' + this.pluarlCheck(interval);
        }

        interval = Math.floor(second / 86400);
        if (interval > 1) {
            return interval + ' day' + this.pluarlCheck(interval);
        }

        interval = Math.floor(second / 3600);
        if (interval > 1) {
            return interval + ' hour' + this.pluarlCheck(interval);
        }

        interval = Math.floor(second / 60);
        if (interval > 1) {
            return interval + ' minute' + this.pluarlCheck(interval);
        }

        return Math.floor(second) + ' second' + this.pluarlCheck(second);
    }

    addToFlatList = (photo_feed, data, photo) => {
        var that = this;
        var photoObj = data[photo];
        database.ref('users').child(photoObj.author).child("username").once('value').then(function (snapshot) {
            const exist = (snapshot.val() !== null);
            if (exist) data = snapshot.val();
            photo_feed.push({
                id: photo,
                url: photoObj.url,
                caption: photoObj.caption,
                posted: that.timeConverter(photoObj.posted),
                timestamp:photoObj.posted,
                author: data,
                authorId: photoObj.author
            });

            var myData = [].concat(photo_feed).sort((a,b)=>a.timestamp < b.timestamp);

            that.setState({
                refresh: false,
                loading: false,
                photo_feed:myData
            });
        }).catch((error) => console.log("error: ", error));
    }

    loadFeed = () => {

        this.setState({
            refresh: true,
            photo_feed: []
        });

        var that = this;
        var loadRef = database.ref('photos');
        if (userId != '') {
            loadRef = database.ref('users').child(userId).child('photos');
        }
        loadRef.orderByChild('posted').once('value').then(function (snapshot) {
            const exist = (snapshot.val() !== null);
            if (exist) {
                data = snapshot.val();
                var photo_feed = that.state.photo_feed;
                that.setState({empty:false})
                for (var photo in data) {
                    that.addToFlatList(photo_feed, data, photo);
                }
            }else{
                that.setState({empty:true})
            }
        }).catch((error) => console.log("error: ", error));
    }

    loadNew = () => {
        this.loadFeed()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.loading == true ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        { this.state.empty == true ?(
                            <Text>No Photo Found...</Text>
                        ):(
                            <Text>Loading....</Text>
            
                        )}
                        </View>
                        
                ) : (
                        <FlatList
                            refreshing={this.state.refresh}
                            onRefresh={this.loadNew}
                            data={this.state.photo_feed}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ flex: 1, backgroundColor: '#eee' }}
                            renderItem={({ item, index }) => (
                                <View key={index} style={{ width: "100%", overflow: "hidden", marginBottom: 5, justifyContent: "space-between", borderBottomWidth: 1, borderColor: 'gray' }}>
                                    <View style={{ padding: 5, width: "100%", flexDirection: "row", justifyContent: 'space-between' }}>
                                        <Text>{item.posted}</Text>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate("User", { userId: item.authorId })}
                                        >
                                            <Text>{item.author}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View>
                                        <Image
                                            source={{ uri: item.url }}
                                            style={{ resizeMode: 'cover', width: "100%", height: 275 }} />
                                    </View>

                                    <View style={{ padding: 5 }}>
                                        <Text>{item.caption}</Text>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('Comments', { photoId: item.id })}
                                        >
                                            <Text style={{ color: 'blue', marginTop: 10, textAlign: 'center' }}>[ View Comments... ]</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    )}
            </View>
        )
    }
}

