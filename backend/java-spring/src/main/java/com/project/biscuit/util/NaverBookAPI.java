package com.project.biscuit.util;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

@Component
@Transactional
public class NaverBookAPI {

    /** Naver api main source
     * @param clientId
     * @param clientSecret
     * @param apiURL
     * @return json (string)
     * @throws IOException
     */
    private String apiSource(String clientId, String clientSecret, String apiURL) throws IOException {
        URL url = new URL(apiURL);
        HttpURLConnection con = (HttpURLConnection)url.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("X-Naver-Client-Id", clientId);
        con.setRequestProperty("X-Naver-Client-Secret", clientSecret);
        int responseCode = con.getResponseCode();
        BufferedReader br;
        if(responseCode==200) { // 정상 호출
            br = new BufferedReader(new InputStreamReader(con.getInputStream()));
        } else {  // 에러 발생
            br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
        }
        String inputLine;
        StringBuffer response = new StringBuffer();
        while ((inputLine = br.readLine()) != null) {
            response.append(inputLine);
        }
        br.close();

        return response.toString();
    }



    /** 제목 검색어에 관련된 책 찾기
         *
         * @param bookTitle
         * @param display
         * @param sort
         * @return json (String)
         */
    public String searchBook(String bookTitle, int display, String sort, int start) {
        String clientId = "PpLGsDhGQYp4IZtz_i_c";
        String clientSecret = "q6ZMMHGAEI";

        try {
            String title = URLEncoder.encode(bookTitle, "UTF-8");
            String apiURL = "https://openapi.naver.com/v1/search/book_adv?d_titl=" + title + "&display=" + display + "&sort=" + sort + "&start=" + start;
            return apiSource(clientId, clientSecret, apiURL);
        } catch (Exception e) {
            return e.toString();
        }
    }

    /** 도서 ISBN으로 하나의 책 찾기
     * @param isbn
     * @return json (string)
     */
    public String searchBookByIsbn(String isbn) {
        String clientId = "PpLGsDhGQYp4IZtz_i_c";
        String clientSecret = "q6ZMMHGAEI";

        try {
            String apiURL = "https://openapi.naver.com/v1/search/book_adv?d_isbn=" + isbn;
            return apiSource(clientId, clientSecret, apiURL);
        } catch (Exception e) {
//            System.out.println(e);
            return e.toString();
        }
    }

}
