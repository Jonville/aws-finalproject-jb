import React, { useState } from "react"
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom"
import { AiFillEye } from "react-icons/Ai"
import { GiArchiveResearch } from "react-icons/Gi"

import SideBar from "../../components/layout/SideBar"
import Loading from "../../components/style/Loading"

import "../../styles/base/sub.css"
import "../../styles/base/booklogStyle.css"


const BooklogPage = () => {

	//-----------------------------------------------------------------------
	//                        날짜 포맷
	//-----------------------------------------------------------------------

	function formatDate(dateArray) {
		const [year, month, day, hour, minute] = dateArray;
		const currentDate = new Date();
		const formattedDate = new Date(year, month - 1, day, hour, minute);
		
		const timeDifference = (currentDate - formattedDate) / (1000 * 60); // 차이를 분으로 계산
	  
		if (timeDifference < 1) {
		  return "방금";
		} else if (timeDifference < 60) {
		  return `${Math.floor(timeDifference)}분 전`;
		} else if (timeDifference < 1440) { // 24시간(1일) 이내
		  return `${Math.floor(timeDifference / 60)}시간 전`;
		} else {
		  return `${year}.${month}.${day}`;
		}
	  }

	//-----------------------------------------------------------------------
	//                        북로그 게시글 리스트
	//-----------------------------------------------------------------------

	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [loading, setLoading] = useState(false);

	const itemsPerPage = 4; // 한 번에 가져올 아이템 수

	const url = `/api/paginate/booklogarticles?page=${currentPage}&size=${itemsPerPage}`;

	const fetchData = () => {
		setLoading(true);
		axios
			.get(url)
			.then((response) => {
				setData((prevData) => [...prevData, ...response.data.content]);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err + " 서버요청 에러 ");
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchData(currentPage); // 컴포넌트가 마운트될 때 데이터 가져오기
	}, [currentPage]);

	// 무한 스크롤 기능
	const handleScroll = () => {
		if (
			window.innerHeight + document.documentElement.scrollTop ===
			document.documentElement.offsetHeight
		) {
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);



	return (
		<main id="pageContainer" className="booklog now">
			<div id="pageVisual" className="darkFixed">
				<h2 className="title">Booklog Now</h2>
				<p className="info">어쩌면 잊혀질 수 있는 지금, 어떤 기록이 남겨지고 있을까요?</p>
			</div>

			<div id="pageContents">
				<section className="mainSection">
					<div className="listArea">
					{data ? data.map((item) => {
						return (
						<Link className="listItem" to={`/booklog/${item.booklog_no.user.userId}/${item.no}`} key={item.no}>
							<div className="imgBox">
							<img src={item.books_no.bookImgUrl} alt={item.books_no.title} />
							</div>
							<div className="txtBox">
								<div className="booklog">
									<h3 className="title">{item.title}</h3>
									<pre className="content" dangerouslySetInnerHTML={{ __html : item.content}}></pre>
								</div>
								<p>
									<span className="writer">
										<b>by</b>
										<Link to={`/booklog/${item.booklog_no.user.no}`}>
											{item.booklog_no.user.nickname}
										</Link>
									</span>
									<span className="createtime">
										⏲{formatDate(item.created_at)}
									</span>
									<span className="count"><AiFillEye/> {item.cnt}</span>
								</p>
							</div>
						</Link>
						)
					}) : null}
					{loading && <Loading />}
					{!loading && data.length === 0 && <p>No data available.</p>}
					</div>
				</section>
			</div>
			<SideBar>
        <Link to={`/booklog/search`}><button className="search" type="button"><GiArchiveResearch/></button></Link>
			</SideBar>
		</main>
	);
};

export default BooklogPage;
