import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, TouchableHighlight } from 'react-native';
import api from '../../services/api';

import { 
    Container, 
    Header, 
    Avatar, 
    Name, 
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
    Loading
} from './styles';

export default class User extends Component{
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired
    }

    state = {
        stars: [],
        page: 1,
        loading: true,
        refreshing: false
    }

    async componentDidMount(page = 1) {
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        const response = await api.get(`/users/${user.login}/starred`, {
            params: { page },
        });

        this.setState({ stars: response.data, loading: false });
    }

    loadMore = () => {

    }

    refreshList = () => {
        this.setState({ loading: true, refreshing: true });
    }

    handleNavigate = (repository) => {
        const { navigation } = this.props;

        navigation.navigate('Repository', { repository });
    }

    render() {
        const { navigation } = this.props;
        const { stars, loading, refreshing } = this.state;
        const user = navigation.getParam('user');

        return (
            <Container loading={loading}>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>

                {loading ? <Loading><ActivityIndicator color="#7159c1" size={100} /></Loading> : 
                    <Stars
                        onEndReachedThreshold={0.2}
                        onEndReached={this.loadMore}
                        onRefresh={this.refreshList}
                        refreshing={refreshing}
                        data={stars}
                        loadind={loading}
                        keyExtractor={star => String(star.id)}
                        renderItem={({ item }) => (
                            <TouchableHighlight onPress={() => this.handleNavigate(item)}>
                                <Starred>
                                    <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                                    <Info>
                                        <Title>{item.name}</Title>
                                        <Author>{item.owner.login}</Author>
                                    </Info>
                                </Starred>
                            </TouchableHighlight>
                        )}
                    />}
            </Container>
        );
    }
}