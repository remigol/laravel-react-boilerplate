<?php

namespace App\Http\Controllers;

abstract class Controller {
    protected function apiResponse(
        $data = null,
        bool $success = true,
        string $message = 'Success',
        int $status = 200,
        $errors = null
    ) {
        $response = [
            'success' => $success,
            'message' => $message,
            'status'  => $status,
        ];

        if ($success && !is_null($data)) {
            $response['data'] = $data;
        }

        if (!$success && !is_null($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }

    /**
     * Success response with data
     */
    protected function success($data = null, string $message = 'Success', int $status = 200)
    {
        return $this->apiResponse(
            data: $data,
            success: true,
            message: $message,
            status: $status
        );
    }

    /**
     * Error response with errors
     */
    protected function error($errors = null, string $message = 'Error', int $status = 400)
    {
        return $this->apiResponse(
            success: false,
            message: $message,
            status: $status,
            errors: $errors
        );
    }
}
