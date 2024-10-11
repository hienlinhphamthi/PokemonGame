import autobind from "autobind-decorator";
import { validate } from "class-validator";
import { User} from '../models/User';
import { error } from "shelljs";

export class UserController{ // xử lí sự kiện khi người dùng kích hoạt nút playgame
    constructor(public element:HTMLElement) {
        const button = element.querySelector('#play');

        console.log('UserController constructor');

        button?.addEventListener('click', this.processPlayButtonClick); 
    }

    @autobind 
    processPlayButtonClick(event:Event) {
        event.preventDefault(); // xử lí sự kiện chạy ngầm định  / ngăn chặn việc gửi biểu mẫu
        console.log('event...');

        const form = this.element.querySelector('form') as HTMLFormElement; // truyền thuộc tính form trong thành phần htmlelemet trong login.ejs , 
        const usernameElement = this.element.querySelector('#username') as HTMLInputElement; // Tạo một đối tượng User từ giá trị của trường nhập username.
        const helpId = this.element.querySelector('#UsernameHelpId');
        // Sử dụng class-validator để kiểm tra và xác nhận dữ liệu của đối tượng User.
        if(usernameElement){ //  kiểm tra xem usernameElement có tồn tại hay không.
            let user: User = new User(usernameElement.value);
            validate(user).then(errors=>{
                if(errors.length>0){
                    if(helpId){
                        helpId.className = 'form-text text-muted visible';
                    }
                }else{
                    form.submit();
                }
            })
        }
    }
}

