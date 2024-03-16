/**
 * illuminarean hiring challenge
 * 
 * 이 코드는 일루미나리안의 QA 엔지니어 과제 테스트를 위해 작성되었습니다.
 * 실행 목표는 아래와 같습니다.
 * - 이동 경로 : 일루미나리안 사이트 (https://illuminarean.com/) ＞ [Work] ＞ [GOODVIBE WORKS 바로가기] ＞ [무료 체험 신청] > 내용 입력 ＞ 신청 취소
 * - 담당 업무 리스트에서 클릭으로 1개, 검색으로 1개 선택
 * - 그 외 내용은 자유롭게 채워 넣음
 * - 무료 이용 신청 버튼은 클릭하지 않음
 * 
 * @author taeseong
 * @version 1.0.0
 * @since 2024-03-15
 */
import { Page, test, expect } from '@playwright/test';
import { config, fillData } from './config';

test.describe('illuminarean', () => {
  let illuminareanTab: Page; // illuminarean.com 사이트 테스트에서 사용할 페이지 객체
  let goodvibeTab: Page; // works.goodvibe.kr 사이트 테스트에서 사용할 페이지 객체

  test.beforeAll(async ({ browser }) => {
    illuminareanTab = await browser.newPage(); // illuminarean.com 탭 초기화
  });

  test('hiring challenge', async() => {

    await test.step('[illuminarean] 사이트 접속 및 정상 접속 확인', async() => {
      await illuminareanTab.goto(config.illuminareanMainUrl); // illuminarean.com 메인 화면 접속
      await expect(illuminareanTab).toHaveURL(config.illuminareanMainUrl); // 페이지 URL을 확인하여 검증
    });

    await test.step('[illuminarean] Main > 페이지 타이틀 확인', async() => {
      await expect(illuminareanTab).toHaveTitle(/일루미나리안/); // 테스트 대상 페이지인지 확인하기 위해 타이틀 확인
    });

    await test.step('[illuminarean] Main > 인재 POOL 모달 > 닫기 버튼 Click', async() => {
      if (await isElementVisible(illuminareanTab, 'button[aria-label="company:close_modal"]')) {
        await illuminareanTab.click('button[aria-label="company:close_modal"]'); // 닫기 버튼의 button태그 aria-label 속성을 이용하여 클릭 처리
      } else {
        console.warn('[illuminarean] Main > 인재 POOL 모달이 존재하지 않습니다.');
      }
    });

    await test.step('[illuminarean] Main > 인재 POOL 모달 > 숨겨졌는지 확인', async() => {
      const isVisible:boolean = await isElementVisible(illuminareanTab, 'div[class="ReactModalPortal"]');
      expect(isVisible).toBeFalsy();
    });

    await test.step('[illuminarean] Work > 메뉴로 이동', async() => {
      await illuminareanTab.click('a[aria-label="a11y:Work"]'); // Work 메뉴 클릭
      await illuminareanTab.waitForURL(config.illuminareanWorkUrl); // Work 페이지 URL로의 이동을 기다림
    });

    await test.step('[illuminarean] Work > 페이지 접속 확인', async() => {
      await expect(illuminareanTab).toHaveURL(config.illuminareanWorkUrl); // 페이지 URL을 확인하여 검증
    });

    await test.step('[illuminarean] Work > 페이지 타이틀 확인', async() => {
      await expect(illuminareanTab).toHaveTitle(/Work | 일루미나리안/);
    });

    await test.step('[illuminarean] Work > GOODVIBE WORKS 바로가기 클릭', async() => {
      await illuminareanTab.focus('a:text("GOODVIBE WORKS 바로가기")');
      const [goodvibeTabPromise] = await Promise.all([
        illuminareanTab.context().waitForEvent('page'), // 새 탭이 열릴 때 발생하는 이벤트를 기다립니다.
        illuminareanTab.click('a:text("GOODVIBE WORKS 바로가기")'), // 링크 클릭
      ]);
      
      goodvibeTab = goodvibeTabPromise;
      await goodvibeTab.waitForLoadState('load');
    });

    await test.step('[GOODVIBE WORKS] 페이지 접속 확인', async() => {
      await expect(goodvibeTab).toHaveURL(config.goodvideWorksMainUrl);
    });

    await test.step('[GOODVIBE WORKS] 페이지 타이틀 확인', async() => {
      await expect(goodvibeTab).toHaveTitle(/굿바이브웍스 GoodVibeWorks - 엔터테인먼트 정산 서비스/);
    });

    await test.step('[GOODVIBE WORKS] 무료 체험 신청 버튼 클릭', async() => {
      await goodvibeTab.waitForTimeout(2000); // 애니메이션이 작동하기 전에도 버튼이 클릭되나 애니메이션 동작 확인을 위해 대기시간 추가
      await goodvibeTab.click('button >> text="무료 체험 신청"');
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 모달 활성화 여부 확인', async() => {
      await expect(goodvibeTab.locator('div[aria-label="서비스 이용신청 모달"]')).toHaveCount(1, { timeout: 1000 });
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 필드 값 입력', async() => {
      await fillFormFields();
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 사업자유형 임의의 값 선택', async() => {
      await selectRandomOptionFromSelectBox('#businessType');
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 직원수 임의의 값 선택', async() => {
      await selectRandomOptionFromSelectBox('#scale');
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 담당 업무 클릭으로 선택', async() => {
      await selectDutyByClick();
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 담당 업무 검색으로 선택', async() => {
      await selectDutyBySearch();
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 서비스 이용약관 동의 링크 클릭 후 링크 확인', async() => {
      await clickLinkAndVerifyUrl(
        goodvibeTab,
        '서비스 이용약관 동의',
        config.goodvideWorksAgreementUrl
      );
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 서비스 이용약관 동의 선택', async() => {
      await goodvibeTab.click('#agreeTermsOfUse');
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 개인정보 취급방침 동의 링크 클릭 후 링크 확인', async() => {
      await clickLinkAndVerifyUrl(
        goodvibeTab,
        '개인정보 취급방침 동의',
        config.goodvideWorksPrivacyUrl
      );
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 개인정보 취급방침 동의 선택', async() => {
      await goodvibeTab.click('#agreePrivacyStatement');
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 필드 값이 입력되었는지 검증', async() => {
      await verifyFormInputs();
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 신청 취소 버튼 클릭', async() => {
      await goodvibeTab.click('button >> text="신청 취소"');
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 취소 확인 버튼 클릭', async() => {
      await goodvibeTab.click('button >> text="확인"');
    });

    await test.step('[GOODVIBE WORKS] 서비스 이용신청 > 모달 닫힘 확인', async() => {
      await expect(goodvibeTab.locator('div[aria-label="서비스 이용신청 모달"]')).toHaveCount(0, { timeout: 1000 });
    });

  });

  test.afterAll(async({ browser }) => {
    // 테스트 종료 후 close 및 stop 일괄 처리 / 객체가 null 인경우를 조건부 체이닝으로 예외처리
    await (illuminareanTab?.isClosed() ? Promise.resolve() : illuminareanTab.close());
    await (goodvibeTab?.isClosed() ? Promise.resolve() : goodvibeTab.close());
    browser.close();
  });






  /**
   * react-select 영역의 option을 임의로 입력하기 위한 함수
   * 
   * @param selectBoxId - 옵션을 선택할 Select Box의 ID ('#businessType' / '#scale')
   * 
   * 이 함수는 주어진 react-select 영역의 option 목록이 로드되면
   * 랜덤하게 하나의 옵션을 선택하는 동작을 수행합니다.
   */
  async function selectRandomOptionFromSelectBox(selectBoxId: string) {
    // SelectBox를 열기 위한 클릭
    await goodvibeTab.click(`${selectBoxId} .react-select__control`);
  
    // 옵션 목록이 로드 대기
    await goodvibeTab.waitForSelector(`${selectBoxId} .react-select__menu`);
  
    // 옵션 목록 텍스트 추출
    const options = await goodvibeTab.$$eval(`${selectBoxId} .react-select__option`, options => options.map(option => option.innerText));
  
    // 추출한 옵션 중 Math.random을 이용해 랜덤한 값 선택
    const randomOption = options[Math.floor(Math.random() * options.length)];
  
    // 선택된 옵션을 클릭
    await goodvibeTab.click(`${selectBoxId} .react-select__option >> text="${randomOption}"`);
  }

  /**
   * 담당 업무 선택 영역 클릭
   */
  async function openDutySelector() {
    await goodvibeTab.click('button >> text="담당 업무를 1개 이상 선택해 주세요."');
    await goodvibeTab.waitForSelector('dl.duties div.visible-scroll');
  }

  /**
   * 임의의 담당 업무 선택
   */
  async function selectRandomDuty() {
    const buttons = await goodvibeTab.$$eval('dl.duties div.visible-scroll button', buttons => buttons.map(button => button.innerText));
    const randomOption = buttons[Math.floor(Math.random() * buttons.length)];
    await goodvibeTab.click(`dl.duties div.visible-scroll button >> text="${randomOption}"`);
  }

  /**
   * 클릭을 통해 담당 업무를 등록
   */
  async function selectDutyByClick() {
    await openDutySelector();
    await selectRandomDuty();
    await goodvibeTab.click('button:has-text("등록")');
  }

  /**
   * 검색을 통해 담당 업무를 등록
   */
  async function selectDutyBySearch() {
    const placeholder = 'input[placeholder="업무명 검색"]';
    await openDutySelector();
    await goodvibeTab.click(placeholder);
    const buttons = await goodvibeTab.$$eval('dl.duties div.visible-scroll button', buttons => buttons.map(button => button.innerText));
    const randomOption = buttons[Math.floor(Math.random() * buttons.length)];
    await goodvibeTab.type(placeholder, randomOption);
    await goodvibeTab.press(placeholder, 'Enter');
    await goodvibeTab.waitForTimeout(1000);
    await goodvibeTab.click(`button:has-text("${randomOption}")`);
    await goodvibeTab.click('button:has-text("등록")');
  }

  /**
   * 지정된 텍스트를 포함하는 링크를 클릭 후 새로 열린 탭의 URL을 검증
   * 
   * @param page - Playwright의 Page 인스턴스
   * @param linkText - 클릭할 링크의 텍스트
   * @param expectedUrl - 링크의 검증 URL
   */
  async function clickLinkAndVerifyUrl(page: Page, linkText: string, expectedUrl: string): Promise<void> {
    const [newTab] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click(`span:has-text("${linkText}") + a`),
    ]);
    await newTab.waitForLoadState('load');
    await expect(newTab).toHaveURL(expectedUrl);
  }

  /**
   * 페이지에 특정 요소가 존재하는지 확인
   * 
   * @param page - Playwright의 Page 인스턴스
   * @param selector - 대상 element 의 selector
   * @returns element가 존재하면 true, 존재하지 않으면 false를 반환
   */
  async function isElementVisible(page: Page, selector: string): Promise<boolean> {
    const elementCount = await page.locator(selector).count();
    return elementCount > 0;
  }

  /**
   * input type text 필드에 사용자 입력 값을 입력
   */
  async function fillFormFields() {
    // 일반 input type text 입력하기 위한 필드와 값 선언
    const fields = {
      companyName: fillData.companyName,
      ceoName: fillData.ceoName,
      name: fillData.name,
      email: fillData.email,
      mobile: fillData.mobile,
    };
    // 미리 선언해둔 fields에 선언한 값들을 화면에 입력
    for (const [fieldName, value] of Object.entries(fields)) {
      await goodvibeTab.fill(`input[name="${fieldName}"]`, value);
    }
  }
  
  /**
   * 서비스 이용신청 필드 값이 입력되었는지 검증
   */
  async function verifyFormInputs() {
    // 필드와 값을 매핑하는 객체
    const fieldValues = {
      companyName: fillData.companyName,
      ceoName: fillData.ceoName,
      name: fillData.name,
      email: fillData.email,
      mobile: fillData.mobile
    };

    // 모든 필드에 대해 반복하여 검증
    for (const [fieldName, expectedValue] of Object.entries(fieldValues)) {
      await test.step(`[GOODVIBE WORKS] 서비스 이용신청 > ${fieldName} 값이 입력되었는지 검증`, async() => {
        const inputLocator = goodvibeTab.locator(`input[name="${fieldName}"]`);
        await expect(inputLocator).toHaveValue(expectedValue);
      });
    }
    // 담당 업무 선택 여부 검증
    await expect(goodvibeTab.locator('dl.duties ul.visible-scroll')).toHaveCount(1, { timeout: 1000 });
    
    // 서비스 이용약관 동의
    await expect(goodvibeTab.locator('label[for="agreeTermsOfUse"] span svg[data-icon="square-check"]')).toHaveCount(1, { timeout: 1000 });

    // 개인정보 취급방침 동의
    await expect(goodvibeTab.locator('label[for="agreePrivacyStatement"] span svg[data-icon="square-check"]')).toHaveCount(1, { timeout: 1000 });
  }
});
