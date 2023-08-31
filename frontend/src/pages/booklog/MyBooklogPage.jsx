import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FcFolder } from "react-icons/Fc";

import { AiFillEye } from "react-icons/Ai"

import Loading from "../../components/style/Loading";
import SideBar from "../../components/layout/SideBar";
import { Context } from "../../components/store/Context";

import "react-tabs/style/react-tabs.css";

function MyBooklogPage() {

	//-----------------------------------------------------------------------
	//                        로그인 된 정보 가져오기
	//-----------------------------------------------------------------------

	// 비로그인 시 userInfo.no 를 null 로 만듬
	const initialUserInfo = { no: null };

	// Context 로 로그인된 정보를 가져오는거
	const props = useContext(Context);
	const userInfo = props.userInfo || initialUserInfo;

	// 비로그인시 접근불가
	const navigate = useNavigate();

	// useEffect(() => {
	//   // userInfo가 null인지 확인하고, 맞다면 로그인 페이지로 리디렉션
	//   if (userInfo.no === null) {
	// 		alert("로그인을 해주세요~");
	//     navigate('/auth/signin'); // '/login'은 실제 로그인 페이지의 경로로 대체해주세요
	//   }
	// }, [userInfo, navigate]);

	//-----------------------------------------------------------------------
	//                        북로그 게시글 상세보기
	//-----------------------------------------------------------------------

	const [tabSelectedIndex, setTabSelectedIndex] = useState(0); // 탭 패널 선택 인덱스 상태 추가

	const { no } = useParams(); // URL에서 식별자 값 가져오기

	const param = useParams(); // no -> userid 로 체인징

	const [myBooklogData, setmyBooklogData] = useState("");

	const myBooklogUrl = `/api/booklogs/${no}`;

	const fetchmyBooklogData = () => {
		const userData = { "response.data.user_no.userId": param.no };

		axios
			.get(myBooklogUrl, userData)
			.then((response) => {
				setmyBooklogData(response.data);
			})
			.then(userData)
			.catch((err) => {
				console.log(err + " 서버요청 에러 ");
			});
	};

	useEffect(() => {
		fetchmyBooklogData();
	}, [no]);

	//-----------------------------------------------------------------------
	//                        북로그 별 게시글 리스트
	//-----------------------------------------------------------------------

	const [articlesData, setarticlesData] = useState("");

	const articlesUrl = `/api/booklogarticles/user/${no}`;

	const fetchArticlesData = () => {
		axios
			.get(articlesUrl)
			.then((response) => {
				setarticlesData(response.data);
			})
			.catch((err) => {
				console.log(err + " 서버요청 에러 ");
			});
	};

	useEffect(() => {
		fetchArticlesData();
	}, [no]);

	// //-----------------------------------------------------------------------
	// //                        groups 별 북로그 리스트
	// //-----------------------------------------------------------------------

	const [selectedGroup, setSelectedGroup] = useState(null);

	const [isSelectedGroup, isSetSelectedGroup] = useState(false);

	const handleGroupByArticlesClick = (groupName) => {
		setSelectedGroup(groupName);
		isSetSelectedGroup(!isSelectedGroup);

	};

	//-----------------------------------------------------------------------
	//                        구독자 리스트
	//-----------------------------------------------------------------------

	const [subscribersData, setSubscribersData] = useState("");

	const subscribersUrl = `/api/subscribers/${no}`;

	const fetchSubscribersData = () => {
		axios
			.get(subscribersUrl)
			.then((response) => {
				setSubscribersData(response.data);
			})
			.catch((err) => {
				console.log(err + " 서버요청 에러 ");
			});
	};

	useEffect(() => {
		fetchSubscribersData();
	}, [no]);

	//-----------------------------------------------------------------------
	//                        구독자 블로그 리스트
	//-----------------------------------------------------------------------

	const [subscribeBlogData, setSubscribeBlogData] = useState("");

	const subscribeBlogUrl = `/api/subscribeBlog/${no}`;

	const fetchSubscribeBlogData = () => {
		axios
			.get(subscribeBlogUrl)
			.then((response) => {
				setSubscribeBlogData(response.data);
			})
			.catch((err) => {
				console.log(err + " 서버요청 에러 ");
			});
	};

	useEffect(() => {
		fetchSubscribeBlogData();
	}, [no]);

	//------------------------------------------------------

	// articlesData를 groups로 묶어서 객체 형태로 변환하는 작업
	const groupedArticles = {};

	for (const articleKey in articlesData) {
		if (articlesData.hasOwnProperty(articleKey)) {
			const article = articlesData[articleKey];
			const groupName = article.groups;

			if (!groupedArticles[groupName]) {
				groupedArticles[groupName] = [];
			}

			// 게시글 데이터에 updatedAt 속성이 있는 경우에만 추가
			if (article.updatedAt) {
				groupedArticles[groupName].push(article);
			}
		}
	}



	//-----------------------------------------------------------------------
	//                            구독하기
	//-----------------------------------------------------------------------

	const [isSubscribed, setIsSubscribed] = useState(false);

	const [subscribedBlogs, setSubscribedBlogs] = useState([]);

	useEffect(() => {
		const storedSubscribedBlogs =
			JSON.parse(localStorage.getItem("subscribedBlogs")) || [];
		setSubscribedBlogs(storedSubscribedBlogs);

		// 현재 블로그가 구독되었는지 여부를 확인하여 isSubscribed 상태 설정
		setIsSubscribed(storedSubscribedBlogs.includes(no));
	}, [no]);

	const handleSubscribeButtonClick = () => {
		if (!userInfo.no) {
			alert("로그인을 해주세요~");
			return;
		}

		if (isSubscribed) {
			// 구독 취소 요청 처리
			axios
				.delete(`/api/subscriptions/${userInfo.no}/${no}`)
				.then((response) => {
					setIsSubscribed(false);
					const updatedSubscribedBlogs = subscribedBlogs.filter(
						(blogId) => blogId !== no,
					); // 해당 블로그 ID를 배열에서 제거
					setSubscribedBlogs(updatedSubscribedBlogs);
					localStorage.setItem(
						"subscribedBlogs",
						JSON.stringify(updatedSubscribedBlogs),
					);
					alert("구독이 취소되었습니다!");
					fetchSubscribeBlogData();
				})
				.catch((error) => {
					console.error("구독 취소 중 오류 발생:", error);
				});
		} else {
			// 구독 요청 처리
			axios
				.post(`/api/subscribe/${userInfo.no}/${no}`)
				.then((response) => {
					const updatedSubscribedBlogs = [...subscribedBlogs, no];
					setSubscribedBlogs(updatedSubscribedBlogs);
					localStorage.setItem(
						"subscribedBlogs",
						JSON.stringify(updatedSubscribedBlogs),
					);
					setIsSubscribed(true);
					alert("구독이 완료되었습니다!");
					fetchSubscribeBlogData();
				})
				.catch((error) => {
					console.error("구독 중 오류 발생:", error);
				});
		}
	}

	// // 컴포넌트가 마운트될 때 로컬 스토리지에서 값 읽어와 초기값 설정
	// useEffect(() => {
	//   const storedIsSubscribed = localStorage.getItem("isSubscribed");
	//   if (storedIsSubscribed === "true") {
	//     setIsSubscribed(true);
	//   }
	// }, []);

	//-----------------------------------------------------------------------
	//                        소개글 수정하기 리스트
	//-----------------------------------------------------------------------

	const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태 관리
	const [editedName, setEditedName] = useState("");
	const [editedIntro, setEditedIntro] = useState("");

	const handleEditButtonClick = () => {
		// 수정하기 버튼 클릭 시 수정 모드 활성화
		setIsEditing(true);
		setEditedName(myBooklogData.booklog_name);
		setEditedIntro(myBooklogData.intro); // 기존 소개글을 수정된 소개글 상태로 설정
	};

	const handleCancelButtonClick = () => {
		setIsEditing(false);
		// 수정 취소 시, 수정 전의 내용으로 복원
		setEditedName(myBooklogData.booklog_name);
		setEditedIntro(myBooklogData.intro);
	};

	const handleSaveButtonClick = () => {
		setIsEditing(false);

		axios
			.put(`/api/booklogs/${myBooklogData.user_no.no}`, {
				booklog_name: editedName,
				intro: editedIntro,
			})
			.then((response) => {
				fetchmyBooklogData();
			})
			.catch((error) => {
				console.error("소개글 수정 중 오류 발생:", error);
			});

		alert("북로그 소개글이 수정되었습니다!");
	};

	// 줄바꿈 적용
	function onEnterChange(e) {
		if (e.key === "Enter") {
			e.preventDefault();
			const textArea = e.target;
			const newText = textArea.value + "\n";
			textArea.value = newText;
		}
	}

	return (
		<main id="pageContainer" className="booklog article">
			{myBooklogData ? (
				<>
					<div id="pageVisual">
						<h2 className="title">
							<span className="nickName">{myBooklogData.user_no.nickname}</span>
							<span className="userId">{myBooklogData.user_no.userId}</span>
						</h2>
						<div className="info">
							<ul>
								<li onClick={() => setTabSelectedIndex(1)}>
									<strong>게시글</strong>
									<span>{articlesData.length}</span>
								</li>
								<Link to={`/booklog/subscribers/${no}`}>
									<li>
										<strong>구독 블로그</strong>
										<span>{subscribersData.length}</span>
									</li>
								</Link>
								<Link to={`/booklog/subscribeBlog/${no}`}>
									<li>
										<strong>구독자</strong>
										<span>{subscribeBlogData.length}</span>
									</li>
								</Link>
							</ul>
							{userInfo.no == myBooklogData.user_no.no ? (
								<Link className="button newBtn" to={`/booklog/article/new`}>
									글쓰기
								</Link>
							) : (
								<button
									className="button subsBtn"
									onClick={handleSubscribeButtonClick}
								>
									{isSubscribed ? "구독중" : "구독하기"}
								</button>
							)}
						</div>
					</div>
					<div id="pageContents" className="article">
						<section className="tabSection">
							<Tabs
								selectedIndex={tabSelectedIndex}
								onSelect={(index) => setTabSelectedIndex(index)}
							>
								<TabList className="tabList">
									<Tab
										className="tabItem"
										onClick={() => setTabSelectedIndex(0)}
									>
										카테고리
									</Tab>
									<Tab
										className="tabItem"
										onClick={() => setTabSelectedIndex(1)}
									>
										글
									</Tab>
									<Tab
										className="tabItem"
										onClick={() => setTabSelectedIndex(2)}
									>
										소개
									</Tab>
								</TabList>
								<TabPanel className="tabGroup">
									{articlesData ? (
										<div className="typeCate">
											<ul className="listArea">
												{Object.entries(groupedArticles).map(
													([groupName, groupArticles]) => (
														<li key={groupName} >
															<li  className="listItem">
															<h4
																className="title"
																onClick={() => handleGroupByArticlesClick(groupName)}
															>
																<FcFolder /> {groupName}
															</h4>
															<div className="info">
																<span className="articleCnt">
																	글 {groupArticles.length}
																</span>
																{groupArticles.length > 0 && (
																	<span className="lastUpdated">
																		마지막 글 :{" "}
																		{
																			groupArticles[groupArticles.length - 1]
																				.updatedAt
																		}
																	</span>
																)}
															</div>
															</li>
															{
																isSelectedGroup && selectedGroup === groupName && ( // 그룹이 열려있을 때만 게시글 표시
																	<ul className="typeArticle">
																		{groupArticles
																			.filter((item) =>
																				selectedGroup
																					? item.groups === selectedGroup
																					: true
																			)
																			.map((item) => (
																				<li
																					key={item.no}
																					className="groupListItem"
																				>

																					<div className="txtBox">
																						<div className="booklog">
																							<Link to={`/booklog/${item.booklog.user.userId}/${item.no}`}>
																								<h3 className="artiTitle">{item.title}</h3>
																								<br />
																								<pre className="content">{item.content}</pre>
																							</Link>
																						</div>
																						<p className="info">
																							<span className="likeCnt">
																								공감
																								{item.likes}
																							</span>
																							<span className="commCnt"><AiFillEye /> {item.cnt}</span>
																							<span className="groupbyCreatetime">{item.createdAt}</span>
																						</p>
																						</div>

																						<div className="imgBBox">
																							<img src={item.books.bookImgUrl} alt={item.books.title} />
																						</div>
																				</li>
																			))}
																	</ul>
																)}
														</li>
													)
												)}
											</ul>
										</div>
									) : null}
								</TabPanel>
								<TabPanel className="tabGroup">
									{articlesData ? (
										<div className="typeArticle">
											<ul className="listArea">
												{articlesData.map((item) => (
													<li key={item.no} className="listItem">
														<Link
															to={`/booklog/${item.booklog.user.userId}/${item.no}`}
														>
															<div className="txtBox">
																<h4 className="cata">{item.groups}</h4>
																<h3 className="artiTitle">
																	{item.title}
																</h3>
																<pre
																	className="content"
																	dangerouslySetInnerHTML={{
																		__html: item.content,
																	}}
																></pre>
																<p className="info">
																	<span className="likeCnt">
																		공감 {item.likes}
																	</span>
																	<span className="commCnt"><AiFillEye /> 
																		{item.cnt}
																	 </span>
																	<span className="updatedAt">
																		{item.updatedAt}
																	</span>
																</p>
															</div>
															<div className="imgBox">
																<img
																	src={item.books.bookImgUrl}
																	alt=""
																/>
															</div>
														</Link>
													</li>
												))}
											</ul>
										</div>
									) : null}
								</TabPanel>
								<TabPanel className="tabGroup">
									{myBooklogData ? (
										<div className="typeInfo">
											{isEditing ? (
												<div className="introBox typeChange">
													<label>
														<strong>북로그명</strong>
														<input
															className="title typeInput"
															type="text"
															value={editedName}
															onChange={(e) => setEditedName(e.target.value)}
														/>
													</label>
													<label>
														<strong>북로그 소개글</strong>
														<textarea
															className="intro typeInput"
															value={editedIntro}
															onChange={(e) => setEditedIntro(e.target.value)}
															onKeyPress={onEnterChange}
														/>
													</label>
													<div className="btnBundle">
														<button
															className="saveInfoBtn"
															onClick={handleSaveButtonClick}
														>
															저장
														</button>
														<button
															className="cancelInfoBtn"
															onClick={handleCancelButtonClick}
														>
															취소
														</button>
													</div>
												</div>
											) : (
												<div className="introBox">
													<h3 className="title">
														{myBooklogData.booklog_name}
													</h3>
													<pre className="intro">{myBooklogData.intro}</pre>
													<p className="since">
														<b>since</b> {myBooklogData.user_no.createdAt}
													</p>
												</div>
											)}
											{userInfo.no == myBooklogData.user_no.no && !isEditing ? (
												<button
													className="changeInfoBtn"
													onClick={handleEditButtonClick}
												>
													수정
												</button>
											) : null}
										</div>
									) : null}
								</TabPanel>
							</Tabs>
						</section>
					</div>
				</>
			) : (
				<Loading />
			)}
			<SideBar />
		</main>
	);
}

export default MyBooklogPage;
