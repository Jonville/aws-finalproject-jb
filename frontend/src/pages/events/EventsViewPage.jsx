import React, { useContext, useEffect, useState } from "react";

import "../../styles/base/sub.css";
import "../../styles/base/eventsStyle.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Context } from "../../components/store/Context";
import { AiTwotoneCalendar } from "react-icons/Ai";
import { SiMicrosoftexcel } from "react-icons/Si";
import SideBar from "../../components/layout/SideBar";

import * as XLSX from "xlsx";

const EventsViewPage = () => {
	//-----------------------------------------------------------------------
	//                        로그인 된 정보 가져오기
	//-----------------------------------------------------------------------

	const navigate = useNavigate();

	// 비로그인 시 userInfo.no 를 null 로 만듬
	const initialUserInfo = { no: null };

	// Context 로 로그인된 정보를 가져오는거
	const props = useContext(Context);
	const userInfo = props.userInfo || initialUserInfo;

	//-----------------------------------------------------------------------
	//                        날짜 포맷
	//-----------------------------------------------------------------------

	function formatDateTime(dateArray) {
		const [year, month, day] = dateArray;

		// 원하는 형식으로 날짜 및 시간 정보 포맷팅
		const formattedDate = `${year}.${month}.${day}`;

		return `${formattedDate}`;
	}

	//-----------------------------------------------------------------------
	//                        이벤트 게시글 정보
	//-----------------------------------------------------------------------

	const [eventDetailData, setEventDetailData] = useState([]);
	const [participationData, setParticipationData] = useState([]);
	const [showParticipation, setShowParticipation] = useState(false);
	const [loading, setLoading] = useState(true);

	const { no } = useParams();
	const eventDetailUrl = `/api/events/${no}`;
	const participationUrl = `/api/participations/events/${no}`;

	const fetchEventDetailData = () => {
		axios
			.get(eventDetailUrl)
			.then((response) => {
				setEventDetailData(response.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err + " 서버요청 에러 ");
				setLoading(false);
			});
	};

	const fetchParticipationData = () => {
		axios
			.get(participationUrl)
			.then((response) => {
				setParticipationData(response.data);
			})
			.catch((err) => {
				console.log(err + " 서버요청 에러 ");
			});
	};

	useEffect(() => {
		fetchEventDetailData();
		fetchParticipationData();
	}, [no]);

	const handleParticipationListButtonClick = () => {
		setShowParticipation(!showParticipation);

		if (participationData.length == 0) {
			alert(
				"참가자가 아직 없습니다. 이벤트에 참가하시려면 참가하기 버튼을 눌러주세요~",
			);
		}
	};

	//-----------------------------------------------------------------------
	//                        이벤트 참가하기
	//-----------------------------------------------------------------------

	const handleParticipationButtonClick = () => {

		if (userInfo?.no == null) {
			alert("로그인을 해주세요~")
		} else {

			axios
				.post(`/api/events/${no}/participate/${userInfo?.no}`)
				.then(() => {

					alert("이벤트에 참가하였습니다.");
					fetchParticipationData(); // 참가자 목록 갱신

				})
				.catch((err) => {
					console.log(err + " 서버요청 에러 ");
				});
		}
	};

	//-----------------------------------------------------------------------
	//                        이벤트 참가취소 하기
	//-----------------------------------------------------------------------

	const isParticipated = participationData.some(
		(item) => item.user_no.no === userInfo?.no,
	);

	const handleCancelParticipationButtonClick = () => {
		axios
			.delete(`/api/events/${no}/participate/${userInfo?.no}`)
			.then(() => {
				alert("이벤트 참가가 취소되었습니다.");
				fetchParticipationData(); // 참가자 목록 갱신
			})
			.catch((err) => {
				console.log(err + " 서버요청 에러 ");
			});
	};

	//-----------------------------------------------------------------------
	//                        참가자 리스트 엑셀 다운로드
	//-----------------------------------------------------------------------

	const downloadExcel = () => {
		const eventTitle = eventDetailData.length > 0 ? eventDetailData[0].event.title : "participants";
		const worksheet = XLSX.utils.json_to_sheet(participationData.map(item => {
			return {
				닉네임: item.user_no.nickname,
				ID: item.user_no.userId.slice(0, 3) + "***",
				신청일: formatDateTime(item.created_at), // 신청한 날짜를 적절한 함수로 포맷
			};
		}));

		// 엑셀 파일 생성
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

		// 파일 다운로드
		XLSX.writeFile(workbook, `${eventTitle}_참가리스트.xlsx`);
	};

	//-----------------------------------------------------------------------
	//                        이벤트 수정하기
	//-----------------------------------------------------------------------

	const handleEditButtonClick = () => {
		// 수정하기 버튼 클릭 시 EventEdit 페이지로 이동
		navigate(`/events/${no}/update`);
	};

	return (
		<main id="pageContainer" className="events">
			{/* <div id="pageVisual">
        <h2 className="title">원하는 페이지 타이틀을 적어주세요.</h2>
        <p className="info">원하는 페이지 타이틀을 적어주세요.</p>
      </div> */}

			{/* #pageContents --- START */}
			{eventDetailData.length > 0 && (
				<>
					{eventDetailData.length > 0 && (
						<>
							{eventDetailData.map((item) => (
								item.images.thumbnailYn == "N" && (
									<div
										id="pageContents"
										className="eventDetail"
										key={item.event.no}
									>
										<section className="titleSection">
											<h3 className="title">{item.event.title}</h3>
											<div className="info">
												<div className="date">
													<AiTwotoneCalendar />
													{formatDateTime(item.event.event_start)} ~{" "}
													{formatDateTime(item.event.event_end)}
												</div>
												<div className="cnt"></div>
											</div>
										</section>
										<section className="mainSection">
											<img src={item.images.imgPath} alt={item.images.imgName} />
											<div>{item.event.content}</div>
										</section>
										<section className="participationSection">
											{userInfo && (
												<>
													{isParticipated ? (
														<button
															className="cancelParticipation"
															onClick={handleCancelParticipationButtonClick}
														>
															참가취소
														</button>
													) : (
														<button
															className="participation"
															onClick={handleParticipationButtonClick}
														>
															참가하기
														</button>
													)}
												</>
											)}

											{/* {userInfo?.authority === "A" && (
												<>
													<button
														className="updateEvent"
														onClick={handleEditButtonClick}
													>
														수정하기
													</button>
												</>
											)} */}
											{participationData.length != 0 && (
												<button className="pListButton" onClick={downloadExcel}>
													<SiMicrosoftexcel /> &nbsp;참가자 리스트
												</button>
											)}

											{/* <button
											className="pListButton"
											onClick={handleParticipationListButtonClick}
										>
											참가자 리스트
										</button>

										{showParticipation && (
											<div className="pList">
												{participationData
													? participationData.map((item) => (
															<section className="pListSection" key={item.no}>
																<span className="nickname">
																	{item.user_no.nickname}{" "}
																</span>
																<span className="userid">
																	{item.user_no.userId.slice(0, 3)}***
																</span>
															</section>
													  ))
													: null}
											</div>
										)} */}

											{!showParticipation && participationData.length === 0 && (
												<div className="pList">
													<div></div>
												</div>
											)}
										</section>
									</div>
								)
							))}
						</>
					)}
				</>
			)}
			<SideBar></SideBar>
		</main>
	);
};

export default EventsViewPage;
