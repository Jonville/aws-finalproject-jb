package com.project.biscuit.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Useraddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "bigint comment '배송지번호'")
    private Long no;

    @Column(columnDefinition = "varchar(30) comment '배송지명'")
    private Long shipName;

    @Column(columnDefinition = "varchar(200) comment '배송지주소'")
    private Long shipAddress;

    @Column(columnDefinition = "varchar(100) comment '배송지상세'")
    private Long shipDetail;

    @Column(columnDefinition = "int(10) comment '우편번호'")
    private Long shipPost;

    @Column(columnDefinition = "varchar(100) comment '수령인'")
    private Long shipTo;

    @Column(columnDefinition = "varchar(1) DEFAULT 'N' comment '기본배송지여부'")
    private Long mainYn;

}
