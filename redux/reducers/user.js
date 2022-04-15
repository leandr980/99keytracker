import {
    USER_STATE_CHANGE,
    USER_POSTS_STATE_CHANGE,
    USER_KEYINFO_STATE_CHANGE,
    USER_KEYINFO_DETAILS_STATE_CHANGE,
    USER_KEYINFO2_STATE_CHANGE
} from "../constants"

const initialState = {
    currentUser: null,
    posts: [],
    keyinfo: [],
    keyinfodetails: [],
    keyinfo2: []
}

export const user = (state = initialState, action) => {
    switch (action.type) {

        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }

        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }

        case USER_KEYINFO_STATE_CHANGE:
            return {
                ...state,
                keyinfo: [...action.keyinfo]
            }

        case USER_KEYINFO_DETAILS_STATE_CHANGE:
            return {
                ...state,
                keyinfodetails: [...action.keyinfodetails]
            }

        case USER_KEYINFO2_STATE_CHANGE:
            return {
                ...state,
                keyinfo2: [...action.keyinfo2]
            }
        default:
            return state;
    }
}