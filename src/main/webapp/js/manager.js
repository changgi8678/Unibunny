$(document).ready(function() {
	// 삭제 버튼 클릭 시 해당 배너 행을 제거하는 이벤트
	// $(document).on('click', '#delete_btn', function () {
	//   $(this).closest('.banner_row').remove();
	//   // 순번 업데이트 함수 호출
	//   updateBannerSequence();
	//   // 삭제 버튼 상태 업데이트
	//   toggleDeleteButton();
	// });

	$('#delete_btn').click(function() {
		$('input[name="checked"]:checked').each(function() {
			$(this).closest('.banner_row').remove();
		});
		// 순번 업데이트 함수 호출
		updateBannerSequence();
		// 삭제 버튼 상태 업데이트
		toggleDeleteButton();
	});
	// 체크박스 상태에 따라 삭제 버튼 활성화/비활성화 함수
	function toggleDeleteButton() {
		var checked = $('input[type="checkbox"]:checked').length > 0;
		$('#delete_btn').prop('disabled', !checked);
	}

	// 체크박스 상태 변경 시 삭제 버튼 활성화/비활성화
	$(document).on('change', 'input[type="checkbox"]', function() {
		toggleDeleteButton();
	});

	// 배너 추가 버튼 클릭 시 새로운 배너 행을 추가하는 이벤트
	$('#add_banner_btn').click(function() {
		// 헤더 행을 제외한 현재 배너 개수 계산
		var bannerCount = $('.banner_row').length - 1;
		var newBannerRow = `
        <div class="banner_row">
          <div class="banner_col banner_checked">
            <input type="checkbox" name="checked">
            <label for="checked"></label>
          </div>
          <div class="banner_col banner_seq">
            <span>${bannerCount + 1}</span>
          </div>
          <div class="banner_col banner_img">
            <div class="image_container">
              <input type="file" class="real_upload" accept="image/*" required>
              <div class="upload">+</div>
            </div>
          </div>
          <div class="banner_col banner_url">
            <div class="url_cont">
              <span>url:</span>
              <input type="text" class="url_input">
            </div>
          </div>
          <div class="banner_col banner_use">
            <div class="use_select">
              <fieldset>
                <label>
                  <input type="radio" name="contact${bannerCount + 1
			}" value="use" checked />
                  <span>사용</span>
                </label>
                <label>
                  <input type="radio" name="contact${bannerCount + 1
			}" value="unuse" />
                  <span>사용 안함</span>
                </label>
              </fieldset>
            </div>
          </div>
        </div>
      `;
		$('.select_banner').append(newBannerRow);
		// 순번 업데이트 함수 호출
		updateBannerSequence();
		// 삭제 버튼 상태 업데이트
		toggleDeleteButton();
	});

	// 전체 선택 체크 박스 기능 추가
	$('#check_all').change(function() {
		var isChecked = $(this).prop('checked');
		$('input[name="checked"]').prop('checked', isChecked);
		// 삭제 버튼 상태 업데이트
		toggleDeleteButton();
	});

	// 개별 체크 박스 선택 시 전체 선택 체크 박스 상태 변화
	$('input[name="checked"]').change(function() {
		var allChecked = true;
		$('input[name="checked"]').each(function() {
			if (!$(this).prop('checked')) {
				allChecked = false;
			}
		});
		$('#check_all').prop('checked', allChecked);
		// 삭제 버튼 상태 업데이트
		toggleDeleteButton();
	});

	// 배너 순번 업데이트 함수
	function updateBannerSequence() {
		$('.banner_row').each(function(index) {
			if (index > 0) {
				// 헤더 행을 제외하고 순번 업데이트
				$(this).find('.banner_seq span').text(index);
			}
		});
	}

	// 이미지 업로드 버튼 클릭 시 실제 파일 업로드 입력을 클릭하도록 하는 이벤트
	$(document).on('click', '.upload', function() {
		$(this).siblings('.real_upload').click();
	});

	// 파일 입력 변경 시 미리보기 및 재업로드 기능
	$(document).on('change', '.real_upload', function() {
		var input = this;
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var imageContainer = $(input)
					.closest('.banner_img')
					.find('.image_container');
				// 기존 이미지 삭제
				imageContainer.find('img').remove();
				imageContainer.append(
					'<img src="' + e.target.result + '" alt="banner image">'
				);
			};
			reader.readAsDataURL(input.files[0]);
		}
	});

	// 수정 완료 버튼 클릭 시 처리할 내용
	$('#submit_changes_btn').click(function() {
		// 여기에 수정된 내용을 전송하는 로직 추가
		alert('수정된 내용을 전송합니다.');
	});
});

// 해당 페이지의 회원 목록을 불러오는 메서드 
function get_member_list(grade, cpage) {
	
	if (grade == "default") {
		grade = "일반회원";
		cpage = 1;
	}
	// 해당 등급의 총 회원 수를 불러오기 위한 코드
	$.ajax({
		url: "/total.member",
		dataType: "json",
		data: {
			grade: grade
		}
	}).done(function(resp) {
		
		let record_count_per_page = resp.record_count_per_page;
		let navi_count_per_page = resp.navi_count_per_page;		
		let record_total_count = resp.total_data; 
	
		// 필요한 Page navigator의 수
		let pageTotalCount = 0;
	
		if (record_total_count % record_count_per_page > 0) {
			pageTotalCount = record_total_count / record_count_per_page + 1;
		} else {
			pageTotalCount = record_total_count / record_count_per_page;
		}
	
		// 현재 페이지의 Page Navigator들 중 시작 번호
		let startNavi = Math.floor((cpage - 1) / navi_count_per_page) * navi_count_per_page + 1; 
		// 현재 페이지의 Page Navigator들 중 끝 번호
		let endNavi = startNavi + navi_count_per_page - 1; 
	
		if (endNavi > pageTotalCount) {
			endNavi = pageTotalCount;
		}
	
		let needNext = endNavi < pageTotalCount;
		let needPrev = startNavi > 1;
		
		// 페이지네이션 HTML 생성
		let pageNation = $(".pagination");
		pageNation.empty();
		
		// '첫 페이지로' 버튼
		pageNation.append("<a class='page_navi arr_navi start_arr" + (needPrev ? "" : " disabled") + "' href='" + (needPrev ? "#" : "javascript:void(0);") + "' data-page='" + (needPrev ? (startNavi - 1) : "") + "'><img class='navi_icon start_navi' src='../image/icon/pagination.png' alt='start navi 로고'></a>");

		// 페이지 번호
		for (let i = startNavi; i <= endNavi; i++) {
			if (cpage === i) {
				pageNation.append("<a class='page_navi active' href='javascript:void(0);' data-page='" + i + "'>" + i + "</a> ");
			} else {
				pageNation.append("<a class='page_navi' href='#' data-page='" + i + "'>" + i + "</a> ");
			}
		}

		// '마지막 페이지로' 버튼
		pageNation.append("<a class='page_navi arr_navi end_arr" + (needNext ? "" : " disabled") + "' href='" + (needNext ? "#" : "javascript:void(0);") + "' data-page='" + (needNext ? (endNavi + 1) : "") + "'><img class='navi_icon end_navi' src='../image/icon/pagination.png' alt='end navi 로고'></a>");
	});
	
	$.ajax({
		url: "/list.member",
		dataType: "json",
		data: {
			grade: grade,
			cpage: cpage
		}
	}).done(function(resp) {
		console.log(cpage);
		let index = cpage * 10 - 9;
		for (let i of resp) {
			let row = $("<div>", { "class": "table_row" });
			let col = $("<div>", { "class": "table_col" });
			let span = $("<span>");
			// table_col 첫번째 요소에 index 값 삽입
			span.text(index++);
			col.append(span);
			row.append(col);
			
			// table_col 두번째 요소에 userid 값 삽입
			col = $("<div>", { "class": "table_col" });
			span = $("<span>");
			span.text(i.userid);
			col.append(span);
			row.append(col);
			
			// table_col 세번째 요소에 nickname 값 삽입
			col = $("<div>", { "class": "table_col" });
			span = $("<span>");
			span.text(i.nickname);
			col.append(span);
			row.append(col);
			
			// table_col 네번째 요소에 join_date 값 삽입
			col = $("<div>", { "class": "table_col" });
			span = $("<span>");
			// Timestamp 값을 원하는 형식으로 변환하기 위해 moment 라이브러리 사용 (예: "MMMM Do YYYY, h:mm:ss a" 형식)
			// let join_date = moment(i.join_date).format('YYYY.MM.dd hh:mm:ss');
			span.text(i.join_date);
			col.append(span);
			row.append(col);
			
			// table_col 다섯번째 요소에 버튼 삽입
			col = $("<div>", { "class": "table_col" });
			let btn = $("<button>");
			if (grade == "블랙리스트"){
				btn.text("해제");
			} else {
				btn.text("등록");
			}
			col.append(btn);
			row.append(col);
			
			// 테이블에 데이터 출력
			$(".list_table").append(row);
			
		}
	});
}
