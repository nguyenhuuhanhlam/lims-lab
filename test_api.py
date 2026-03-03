import urllib.request
import json
import traceback


def test():
    req = urllib.request.Request(
        "http://localhost:8000/api/v1/requests/",
        data=json.dumps({"request_code": "TEST1", "task_data": "[]"}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    try:
        res = urllib.request.urlopen(req)
        print("Success:", res.read().decode("utf-8"))
    except Exception as e:
        print("Error:", e)
        if hasattr(e, "read"):
            print(e.read().decode("utf-8"))


test()
