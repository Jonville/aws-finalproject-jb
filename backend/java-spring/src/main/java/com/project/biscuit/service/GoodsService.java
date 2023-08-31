package com.project.biscuit.service;

import com.project.biscuit.model.Goods;
import com.project.biscuit.model.dto.*;
import com.project.biscuit.repository.GoodsRepository;
import com.project.biscuit.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class GoodsService {
    private final GoodsRepository goodsRepository;

    // 굿즈 전체 목록
    public List<Goods> findAll() {return goodsRepository.findAll();}

    // 판매 중인 굿즈 목록
    public List<GoodsWithImagesDto> findAllSaleYn() { return goodsRepository.findAllBySaleYn();}

    // images 에 event_no 를 join 해서 이벤트 리스트 출력 (read)
    public List<GoodsWithImagesDto> getAllGoodsWithImg() {
        return goodsRepository.findAllGoodsWithImages();
    }

    // image 를 가진 이벤트 게시글
    public List<GoodsWithImagesDto> findByIdGoodsWithImages(Long no) {
        return goodsRepository.findByIdGoodsWithImages(no);
    }

    // 굿즈 등록
    public Goods save(AddGoodsRequest request) {
        return goodsRepository.save(request.toEntity());
    }

    // 굿즈 상세
    public Goods viewGoods(long no) {
        return goodsRepository.findById(no)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + no)
                );
    }


    // 굿즈 수정
    @Transactional
    public Goods update(long no, UpdateGoodsRequest request) {
        Goods goods = goodsRepository.findByNo(no)
                .orElseThrow(() -> new IllegalArgumentException(no + "를 찾을 수 없습니다."));
        goods.update(
                request.getName(),
                request.getPrice(),
                request.getContent(),
                request.getLikes(),
                request.getImages_no(),
                request.getSale_yn(),
                request.getInventory()
        );
        return goods;
    }


}
