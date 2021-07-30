/** @format */

import React, { useState, useQuery } from "react";
import {
	Jumbotron,
	Container,
	CardColumns,
	Card,
	Button,
} from "react-bootstrap";

import { GET_ME } from "../utils/queries";
import { deleteBook } from "../utils/mutations";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
	const [userData, setUserData] = useState({});

	// use this to determine if `useEffect()` hook needs to run again
	const userDataLength = Object.keys(userData).length;
	//******************No idea if this is right need helppp!   */
	const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
		variables: { username: userParam },
	});

	const user = data?.me || data?.user || {};

	// redirect to personal profile page if username is yours
	if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
		return <Redirect to="/profile" />;
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!user?.username) {
		return (
			<h4>
				You need to be logged in to see this. Use the navigation links above to
				sign up or log in!
			</h4>
		);
	}

	getUserData();
	[userDataLength];

	// create function that accepts the book's mongo _id value as param and deletes the book from the database

	//****TODO! HELP!!!!!!!!!!!! */
	const handleDeleteBook = async (bookId) => {
		const token = Auth.loggedIn() ? Auth.getToken() : null;

		if (!token) {
			return false;
		}

		try {
			const response = await deleteBook(bookId, token);

			if (!response.ok) {
				throw new Error("something went wrong!");
			}

			const updatedUser = await response.json();
			setUserData(updatedUser);
			// upon success, remove book's id from localStorage
			removeBookId(bookId);
		} catch (err) {
			console.error(err);
		}
	};

	// if data isn't here yet, say so
	if (!userDataLength) {
		return <h2>LOADING...</h2>;
	}

	return (
		<>
			<Jumbotron fluid className="text-light bg-dark">
				<Container>
					<h1>Viewing saved books!</h1>
				</Container>
			</Jumbotron>
			<Container>
				<h2>
					{userData.savedBooks.length
						? `Viewing ${userData.savedBooks.length} saved ${
								userData.savedBooks.length === 1 ? "book" : "books"
						  }:`
						: "You have no saved books!"}
				</h2>
				<CardColumns>
					{userData.savedBooks.map((book) => {
						return (
							<Card key={book.bookId} border="dark">
								{book.image ? (
									<Card.Img
										src={book.image}
										alt={`The cover for ${book.title}`}
										variant="top"
									/>
								) : null}
								<Card.Body>
									<Card.Title>{book.title}</Card.Title>
									<p className="small">Authors: {book.authors}</p>
									<Card.Text>{book.description}</Card.Text>
									<Button
										className="btn-block btn-danger"
										onClick={() => handleDeleteBook(book.bookId)}
									>
										Delete this Book!
									</Button>
								</Card.Body>
							</Card>
						);
					})}
				</CardColumns>
			</Container>
		</>
	);
};
export default SavedBooks;
