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

// Feature: Illuminarean Hiring Challenge
test.describe('Illuminarean Hiring Challenge', () => {
    let illuminareanTab: Page;
    let goodvibeTab: Page;

    // Background: 사용자가 브라우저를 실행하고 illuminarean 웹사이트에 접속한다.
    test.beforeAll(async ({ browser }) => {
        illuminareanTab = await browser.newPage();
        await illuminareanTab.goto(config.illuminareanMainUrl);
    });

    test('Illuminarean & GOODVIEW WORKS WebSite Scenario Test', async () => {
        // Scenario: [illuminarean] 메인 페이지에 모달이 표시되고 있는 경우
        await test.step('[illuminarean] 메인 페이지에 모달이 표시되고 있는 경우', async () => {
            let btnModalClose = 'button[aria-label="company:close_modal"]';

            // Given 사용자가 illuminarean 메인 페이지에 접속한 상태이며, 모달이 표시되고 있다.
            await verifyPageUrl(illuminareanTab, config.illuminareanMainUrl, /일루미나리안/);

            // When 사용자가 모달을 닫고, Work 메뉴를 클릭한다.
            if (await isElementVisible(illuminareanTab, btnModalClose)) {
                await illuminareanTab.click(btnModalClose); // 닫기 버튼의 button태그 aria-label 속성을 이용하여 클릭 처리
                await illuminareanTab.click('a[aria-label="a11y:Work"]'); // Work 메뉴 클릭
            } else {
                console.warn('illuminarean 메인 화면 모달이 존재하지 않습니다.'); // 다음 Scenario에서 진행하기 때문에 에러로 판단하지 않음
            }

            // Then 모달이 화면에서 사라지고, 메인 화면에서 Work 메뉴로 이동한다.
            if (!await isElementVisible(illuminareanTab, btnModalClose)) {
                await illuminareanTab.waitForURL(config.illuminareanWorkUrl); // Work 페이지 URL로의 이동을 기다림
                await verifyPageUrl(illuminareanTab, config.illuminareanWorkUrl, /Work | 일루미나리안/);
            } else {
                expect(false).toBe('illuminarean 메인 화면 모달이 닫히지 않았습니다');
            }
        });

        // Scenario: [illuminarean] 메인 페이지에 모달이 표시되지 않은 경우
        await test.step('[illuminarean] 메인 페이지에 모달이 표시되지 않은 경우', async () => {
            let btnModalClose = 'button[aria-label="company:close_modal"]';
            let closeModal: boolean = !await isElementVisible(illuminareanTab, btnModalClose);
            let isMain: boolean = (await illuminareanTab.url() === config.illuminareanMainUrl);

            // Given 사용자가 illuminarean 메인 페이지에 접속한 상태이며, 모달이 표시되지 않고 있다.
            if (isMain && closeModal) {
                // When 사용자가 Work 메뉴를 클릭한다.
                await illuminareanTab.click(btnModalClose); // 닫기 버튼의 button태그 aria-label 속성을 이용하여 클릭 처리
                await illuminareanTab.click('a[aria-label="a11y:Work"]'); // Work 메뉴 클릭

                // Then 메인 화면에서 Work 메뉴로 이동한다.
                await illuminareanTab.waitForURL(config.illuminareanWorkUrl); // Work 페이지 URL로의 이동을 기다림
                await verifyPageUrl(illuminareanTab, config.illuminareanWorkUrl, /Work | 일루미나리안/);
            }
        });

        // Scenario: [illuminarean] Work 페이지에서 GOODVIEW WORKS 바로가기 클릭
        await test.step('[illuminarean] Work 페이지에서 GOODVIEW WORKS 바로가기 클릭', async () => {
            // Given 사용자가 Work 페이지에 접속한 상태이다.
            await verifyPageUrl(illuminareanTab, config.illuminareanWorkUrl, /Work | 일루미나리안/);

            // When 사용자가 ‘GOODVIEW WORKS 바로가기’ 버튼을 클릭한다.
            await illuminareanTab.focus('a:text("GOODVIBE WORKS 바로가기")');

            // Then 새 창에서 GOODVIEW WORKS 메인 페이지에 접속된다.
            const [goodvibeTabPromise] = await Promise.all([
                illuminareanTab.context().waitForEvent('page'), // 새 탭이 열릴 때 발생하는 이벤트를 기다립니다.
                illuminareanTab.click('a:text("GOODVIBE WORKS 바로가기")'), // 링크 클릭
            ]);
            goodvibeTab = goodvibeTabPromise;
            await goodvibeTab.waitForLoadState('load');
            await verifyPageUrl(goodvibeTab, config.goodvideWorksMainUrl, /굿바이브웍스 GoodVibeWorks - 엔터테인먼트 정산 서비스/);
        });

        // Scenario: [GOODVIEW WORKS] 메인 화면에서 ‘무료 체험 신청’ 바로가기 클릭
        await test.step('[GOODVIEW WORKS] 메인 화면에서 ‘무료 체험 신청’ 바로가기 클릭', async () => {
            // Given 사용자가 GOODVIEW WORKS 메인 화면에 접속한 상태이다. 
            await verifyPageUrl(goodvibeTab, config.goodvideWorksMainUrl, /굿바이브웍스 GoodVibeWorks - 엔터테인먼트 정산 서비스/);

            // When 사용자가 무료 체험 신청 버튼을 클릭한다.
            await goodvibeTab.waitForTimeout(1000);
            await goodvibeTab.click('button >> text="무료 체험 신청"');

            // Then ‘서비스 이용 신청’ 모달이 화면에 활성화 된다.
            await toHaveCount(goodvibeTab, 'div[aria-label="서비스 이용신청 모달"]', 1, 1000);
        });

        // Scenario: [GOODVIEW WORKS] 서비스 이용 신청 모달의 신청 정보 입력
        await test.step('[GOODVIEW WORKS] 서비스 이용 신청 모달의 신청 정보 입력', async () => {
            // Given 서비스 이용 신청 모달이 화면에 표시되고 있다.
            await toHaveCount(goodvibeTab, 'div[aria-label="서비스 이용신청 모달"]', 1, 2000);

            // When 사용자가 이용 신청 정보를 입력한다.
            await fillFormFields(); // text 필드 값 입력
            await selectRandomOptionFromSelectBox('#businessType'); // 사업자유형 임의의 값 선택
            await selectRandomOptionFromSelectBox('#scale'); // 직원수 임의의 값 선택
            await selectDutyByClick(); // 담당 업무 클릭으로 선택
            await selectDutyBySearch(); // 담당 업무 검색으로 선택
            await goodvibeTab.click('#agreeTermsOfUse'); // 서비스 이용약관 동의 선택
            await goodvibeTab.click('#agreePrivacyStatement'); // 개인정보 취급방침 동의 선택

            // Then 이용 신청 정보가 입력된다.
            await verifyFormInputs(); // 필드 값이 입력되었는지 검증
        });

        // Scenario: [GOODVIEW WORKS] 서비스 이용 신청 내 서비스 이용약관 확인
        await test.step('[GOODVIEW WORKS] 서비스 이용 신청 내 서비스 이용약관 확인', async () => {
            // Given 서비스 이용 신청 모달이 화면에 표시되고 있다.
            await toHaveCount(goodvibeTab, 'div[aria-label="서비스 이용신청 모달"]', 1, 1000);

            // When 사용자가 서비스 이용약관 링크를 클릭, 링크 확인 후 창을 닫는다.
            await clickLinkAndVerifyUrl(
                goodvibeTab,
                '서비스 이용약관 동의',
                config.goodvideWorksAgreementUrl
            );

            // Then 서비스 이용약관 페이지가 새 창으로 표시되었다가 닫힌다.
        });

        // Scenario: [GOODVIEW WORKS] 서비스 이용 신청 내 개인정보 취급방침 확인
        await test.step('[GOODVIEW WORKS] 서비스 이용 신청 내 개인정보 취급방침 확인', async () => {
            // Given 서비스 이용 신청 모달이 화면에 표시되고 있다.
            await toHaveCount(goodvibeTab, 'div[aria-label="서비스 이용신청 모달"]', 1, 1000);

            // When 사용자가 개인정보 취급방침 링크를 클릭, 링크 확인 후 창을 닫는다.

            await clickLinkAndVerifyUrl(
                goodvibeTab,
                '개인정보 취급방침 동의',
                config.goodvideWorksPrivacyUrl
            );

            // Then 개인정보 취급방침 페이지가 새 창으로 표시되었다가 닫힌다.
        });

        // Scenario: [GOODVIEW WORKS] 서비스 이용 신청 모달 닫기
        await test.step('[GOODVIEW WORKS] 서비스 이용 신청 모달 닫기', async () => {
            // Given 서비스 이용 신청 모달이 화면에 표시되고 있다.
            await toHaveCount(goodvibeTab, 'div[aria-label="서비스 이용신청 모달"]', 1, 1000);

            // When 사용자가 신청 취소 버튼을 클릭한다.
            await goodvibeTab.click('button >> text="신청 취소"');

            // Then 작성 중인 내용이 저장되지 않고 사라짐 알림 창이 표시된다.
            await toHaveCount(goodvibeTab, 'span >> text="이전 페이지로 돌아갈 경우 작성 중인 내용이 저장되지 않고 사라집니다."', 1, 1000);
        });

        // Scenario: [GOODVIEW WORKS] 서비스 이용 신청에 작성 중인 내용을 저장하지 않고 닫기
        await test.step('[GOODVIEW WORKS] 서비스 이용 신청에 작성 중인 내용을 저장하지 않고 닫기', async () => {
            // Given 서비스 이용 신청 모달 위 작성 중인 내용이 저장되지 않고 사라짐 알림 창이 표시되고 있다.
            await toHaveCount(goodvibeTab, 'div[aria-label="서비스 이용신청 모달"]', 1, 1000);
            await toHaveCount(goodvibeTab, 'span >> text="이전 페이지로 돌아갈 경우 작성 중인 내용이 저장되지 않고 사라집니다."', 1, 1000);

            // When 사용자가 확인 버튼을 클릭한다.
            await goodvibeTab.click('button >> text="확인"');

            // Then 서비스 이용 신청 모달이 닫힌다.
            await toHaveCount(goodvibeTab, 'div[aria-label="서비스 이용신청 모달"]', 0, 1000);
        });
    });

    test.afterAll(async({ browser }) => {
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
    await newTab.waitForTimeout(1500);
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
    await toHaveCount(goodvibeTab, 'dl.duties ul.visible-scroll', 1, 1000);
    
    // 서비스 이용약관 동의
    await toHaveCount(goodvibeTab, 'label[for="agreeTermsOfUse"] span svg[data-icon="square-check"]', 1, 1000);

    // 개인정보 취급방침 동의
    await toHaveCount(goodvibeTab, 'label[for="agreePrivacyStatement"] span svg[data-icon="square-check"]', 1, 1000);
  }

  /**
   * 현재 페이지가 인자로 받은 페이지인지 검증
   * 
   * @param page Playwright Page 객체 - 검증 대상 페이지
   * @param url 기대 URL
   * @param title 기대 URL의 타이틀
   */
  async function verifyPageUrl(page: Page, url: string, title: RegExp) {
    await expect(page).toHaveURL(url); // 페이지 URL을 확인하여 검증
    await expect(page).toHaveTitle(title);
  }

  /**
   * 페이지 내 특정 element의 개수가 기대하는 개수와 일치하는지 확인
   * 
   * @param page Playwright Page 객체 - 검증 대상 페이지
   * @param selector 대상 element의 선택자
   * @param haveCount 기대하는 element의 개수
   * @param timeout 검증 대기시간
   */
  async function toHaveCount(page: Page, selector: string, haveCount: number, timeout: number) {
    await expect(page.locator(selector)).toHaveCount(haveCount, { timeout: timeout });
  } 

});
