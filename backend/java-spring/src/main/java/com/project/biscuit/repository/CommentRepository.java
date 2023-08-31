package com.project.biscuit.repository;

import com.project.biscuit.model.Comment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment , Long> {

    // 게시글 번호에 맞는 댓글 
    @Query("SELECT c FROM Comment c WHERE c.booklog_article.no = :no AND c.delYn = 'N' AND c.upcommentNo IS NULL")
    List<Comment> findByBooklogArticleNo(@Param("no") Long no);

    // 게시글에대한 댓글 삭제
    @Transactional
    @Modifying
    @Query("UPDATE Comment c SET c.delYn = 'Y' WHERE c.no = :commentNo")
    void updateDelYnByNo(Long commentNo);

    @Query("SELECT c FROM Comment c WHERE c.upcommentNo = :no AND c.delYn = 'N'")
    List<Comment> findByUpcommentNo(@Param("no") Long no);

    // 게시글에대한 댓글 수정 ( update )
    @Transactional
    @Modifying
    @Query("UPDATE Comment c SET c.delYn = :content WHERE c.no = :commentNo")
    void updateContentByNo(Long commentNo , String content);

//    // 대댓글 갯수 세기
//    @Query("SELECT COUNT(c) FROM Comment c WHERE c.upcommentNo = :no AND c.delYn = 'N'")
//    Long countByUpcommentNo(Long no);

    // 댓글 전체 갯수
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.booklog_article.no = :articleNo AND c.delYn = 'N'")
    Long countByBooklogArticleNo(@Param("articleNo") Long articleNo);
}
