import React, { useState, useEffect, useContext } from "react"
import axios from "axios"

import { Context } from "../../components/store/Context"

import "../../styles/base/sub.css"
import "../../styles/base/booklogArticleEditStyle.css"


const BooklogArticleEdit = () => {
	const props = useContext(Context);
	const userInfo = props.userInfo

	//-----------------------------------------------------------------------
	//              user_no 으로 게시글 가져와서 booklog_no 지정
	//-----------------------------------------------------------------------	

	const [userNumber, setUserNumber] = useState([]);
	const fetchUserNumber = () => {
		if (!userInfo) return;
		axios
			.get(`/api/booklogs/${userInfo?.no}`)
			.then((response) => {
				setUserNumber(response.data.no);
			})
			.catch((error) => {
				console.error("booklog_no 가져오다 오류났다:", error);
			});
	}
	useEffect(() => fetchUserNumber(), [userInfo])

	const [bookData, setBookData] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [selectedBook, setSelectedBook] = useState(null);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [groups, setGroups] = useState("");
	const [kinds, setKinds] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	useEffect(() => {
		// 북로그 게시글에 올릴 책들 가져오기
		axios
			.get("/api/booklogarticles/books")
			.then((res) => {
				setBookData(res.data);
			})
			.catch((error) => {
				console.error("책 목록 불러오기 오류:", error);
			});
	}, []);

	const handleSearch = () => {
		// 도서 검색 API 호출
		axios
			.get(`/api/booklogarticles/books/search?title=${searchQuery}`)
			.then((res) => {
				setSearchResults(res.data);
				setIsSearchOpen(!isSearchOpen); // 검색 결과 표시 상태 변경
			})
			.catch((error) => {
				console.error("도서 검색 오류:", error);
			});

	};

	const handleBookSelect = (book) => {
		setSelectedBook(book);
		setIsSearchOpen(false); // 선택한 후 검색 결과 닫기
	};

	// 등록시 post 
	const handleArticleSubmit = () => {
		if (!selectedBook || !title || !content || !groups || !kinds) {
			alert("모든 필드를 입력해주세요.");
			return;
		}

		// 게시글 등록 API 호출
		const requestData = {
			title,
			content,
			groups,
			kinds,
			booklog_no: userNumber,
			books_no: selectedBook.no,
		};

		axios
			.post(`/api/booklogarticles/new/${userInfo.no}`, requestData,)
			.then((res) => {
				// 등록 성공 처리 및 페이지 이동 등 필요한 동작 수행
				alert("게시글이 등록되었습니다!")
				window.location.href = "/biscuit-project/booklog/now"

			})
			.catch((error) => {
				console.error("게시글 등록 오류:", error);
				// 오류 처리 로직을 추가할 수 있습니다.
			});
	};

	return (
		<main id="pageContainer" className="booklog edit">
			<div id="pageVisual">
				<h2 className="title">Create Post</h2>
				<p className="info">독서를 하고 떠오르는 생각과 느낌을 가벼운 기록으로 남겨 보세요.</p>
			</div>


			<div id="pageContents" className="articleEdit">
				<section className="formSection">
					<label className="title">
						<strong>제목</strong>
						<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
					</label>
					<label className="groups">
						<strong>그룹</strong>
						<input type="text" value={groups} onChange={(e) => setGroups(e.target.value)} />
					</label>
					<label className="kinds">
						<strong>분류</strong>
						<input type="text" value={kinds} onChange={(e) => setKinds(e.target.value)} />
					</label>
					<label className="content">
						<strong>내용</strong>
						<textarea value={content} onChange={(e) => setContent(e.target.value)} />
					</label>
					{/* <section className="btmSection"> */}
					<div className="search">
						<div>
							<input
								type="text"
								placeholder="도서 제목을 입력하세요"
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<button onClick={handleSearch}>
								{isSearchOpen ? "검색 닫기" : "도서 검색 버튼"}
							</button>

							{isSearchOpen && (
								<ul>
									{searchResults.map((book) => (
										<li className="searchValue" key={book.no}>
											<div>
												<img className="bookImg" src={book.bookImgUrl} alt={book.title} />
												<strong>{book.title}</strong>
												<div className="bookDetail">{book.detail}</div>
											</div>
											<div className="bookAuthor">저자: {book.author}</div>
											<div className="bookPublisher">출판사: {book.publisher}</div>
											<button onClick={() => handleBookSelect(book)}>선택</button>
										</li>
									))}
								</ul>
							)}

						</div>
					</div>
					{selectedBook && (
						<div className="searchValue">
							<h3>선택한 도서 정보</h3>
							<div>
								<img className="bookImg" src={selectedBook.bookImgUrl}></img>
								<strong>{selectedBook.title}</strong>
								<div className="bookDetail">{selectedBook.detail}</div>
							</div>
							<div className="bookAuthor">저자: {selectedBook.author}</div>
							<div className="bookPublisher">출판사: {selectedBook.publisher}</div>
						</div>
					)}
				</section>
				<button onClick={handleArticleSubmit}>등록</button>
			</div>
		</main>
	);
};

export default BooklogArticleEdit;
