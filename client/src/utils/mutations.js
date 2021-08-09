/** @format */

import gql from "graphql-tag";

export const LOGIN_USER = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				_id
				username
			}
		}
	}
`;

export const ADD_USER = gql`
	mutation addUser($username: String!, $email: String!, $password: String!) {
		addUser(username: $username, email: $email, password: $password) {
			token
			user {
				_id
				username
			}
		}
	}
`;
//********* TODO Need to send entire book through, not just ID */
export const SAVE_BOOK = gql`
	mutation saveBook($bookData: bookInput) {
		saveBook(bookData: $bookData) {
			_id
			username
			savedBooks {
				bookId
				title
			}
		}
	}
`;

export const DELETE_BOOK = gql`
	mutation deletebook($id: ID!) {
		deleteBook(bookId: $id) {
			_id
			username
			email
			savedBooks {
				bookId
				authors
				description
				image
				link
				title
			}
		}
	}
`;
