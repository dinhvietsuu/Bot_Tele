const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");
const moment = require("moment");

// Thay TOKEN bằng mã token của bạn
const token = "7631654175:AAFshUy_QyaigTEnJoDX1FOcVwNmeTNM3YU";
const bot = new TelegramBot(token, { polling: true });
//update
// Khi có người gửi lệnh /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Chào bạn! Gọi lệnh /Deadline <thời gian> <tên người nhận> <tin nhắn> để tạo nhắc nhở.");
});

// Khi có người gửi lệnh /Deadline
bot.onText(/\/Deadline (.+)/, (msg, match) => {
    const chatId = msg.chat.id; // Lấy chatId của nhóm
    const input = match[1].split(" ");

    // Lấy thời gian và thông tin nhắc nhở
    const timeStr = input[0] + " " + input[1];
    const username = input[input.length - 1]; // Lấy phần tử cuối cùng

    const message = input.slice(2, -1).join(" ");

    const reminderTime = moment(timeStr, ["DD/MM HH:mm", "DD-MM HH:mm", "HH:mm DD/MM", "HH:mm DD-MM"], true);

    if (!reminderTime.isValid()) {
        bot.sendMessage(
            chatId,
            'Định dạng không hợp lệ. Vui lòng sử dụng một trong các định dạng sau: "DD/MM HH:mm" hoặc "DD-MM HH:mm" hoặc "HH:mm DD/MM" hoặc "HH:mm DD-MM".'
        );
        return;
    }

    const remindBeforeOneMinute = reminderTime.clone().subtract(1, "minutes");

    // Thiết lập nhắc nhở
    schedule.scheduleJob(remindBeforeOneMinute.toDate(), () => {
        // Tag username (chú ý thêm dấu @)
        bot.sendMessage(
            chatId,
            `Deadline cho task này sẽ kết thúc vào ${reminderTime.format("DD/MM HH:mm")}, đẩy nhanh tiến độ lên nào ${username}.`
        );
    });

    // Thông báo tạo nhắc nhở thành công
    bot.sendMessage(
        chatId,
        `Deadline đã được thiết lập vào lúc ${reminderTime.format(
            "DD/MM HH:mm"
        )}. Tôi sẽ nhắn bạn trước 1 phút, bạn chỉ cần tập trung xử lý task công việc này, thật tuyệt nếu bạn đạt được Deadline này.`
    );
});
